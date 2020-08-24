const firebase = require('firebase');
const { db, admin } = require('./admin');
const firebaseConfig = require('./config');
var Busboy = require('busboy');


firebase.initializeApp(firebaseConfig);
const { validateSignUp, validateLogin, reduceUserDetails } = require('./validators');
const { createSecretKey } = require('crypto');

exports.signup = (request, response) => {
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle

    }


    const { valid, errors } = validateSignUp(newUser);
    if (!valid) {
        return response.status(400).json(errors);
    }

    const profileImg = 'blood.png';

    let token, userId;
    db
        .doc(`/users/${newUser.handle}`).get()
        .then((doc) => {
            if (doc.exists) {
                return response.status(400).json({ handle: 'this handle is already taken' });
            }
            else {
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password);
            }
        })
        .then((data) => {
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then((idToken) => {
            token = idToken;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${profileImg}?alt=media`,
                createdAt: new Date().toISOString(),
                userId
            };
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);

        })
        .then(() => {
            return response.status(201).json({ token })
        })
        .catch((err) => {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                return response.status(500).json({ email: "Email already used" })
            }
            else {
                return response.status(500).json({ error: err.code })
            }

        })
}

exports.login = (request, response) => {
    const user = {
        email: request.body.email,
        password: request.body.password,

    }

    const { valid, errors } = validateLogin(user);

    if (!valid) {
        return response.status(400).json({ errors })
    }

    firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            return data.user.getIdToken();
        })
        .then((token) => {
            return response.json({ token });
        })
        .catch((err) => {
            console.error(err)
            if (err.code === "auth/wrong-password") {
                return response.status(500).json({ Password: "Please fill the rigth password" })
            }
            else
                return response.status(500).json({ error: err.code })
        })
}

exports.uploadImage = (request, response) => {
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    var busboy = new Busboy({ headers: request.headers });

    let imageName;
    let imageToBeUploaded = {};
    if (request.method === 'POST') {
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            if (mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
                return response.status(400).json({ error: "Wrong file type submitted" })
            }
            const imageExtension = filename.split('.')[filename.split('.').length - 1];
            imageName = `${Math.round(Math.random() * 100000000)}.${imageExtension}`;
            const saveTo = path.join(os.tmpdir(), imageName);
            imageToBeUploaded = { saveTo, mimetype };
            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('finish', () => {
            admin.storage().bucket().upload(imageToBeUploaded.saveTo, {
                resumable: false,
                metadata: {
                    metadata: {
                        contentType: imageToBeUploaded.mimetype
                    }
                }
            }).then(() => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageName}?alt=media`;
                console.log(request.user.handle);
                return db.doc(`/users/${request.user.handle}`).update({ imageUrl })
            }).then(() => {
                return response.json({ message: "image uploaded successfully" })
            }).catch((err) => {
                console.error(err);
                return response.status(500).json({ error: err.code });
            });
        });
        busboy.end(request.rawBody);
    }


};

//add user details
exports.addUserDetails = (request, response) => {
    let userDetails = reduceUserDetails(request.body);
    db.doc(`/users/${request.user.handle}`).update(userDetails)
        .then((data) => {
            return response.json({ message: 'Details added successfully' })
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code })
        });
};

exports.getAuthenticatedUser = (request, response) => {
    let authUser = {};
    db.doc(`/users/${request.user.handle}`)
        .get()
        .then((data) => {
            if (data.exists) {
                authUser.credentials = data.data();
                return db.collection("likes").where("userHandle", "==", request.user.handle).get();
            }
        })
        .then((data) => {
            authUser.likes = [];
            data.forEach((doc) => {
                authUser.likes.push(doc.data());
            })
            return response.json(authUser);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err })
        })
}

