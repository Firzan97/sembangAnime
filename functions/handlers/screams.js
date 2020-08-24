const { db } = require('../util/admin');
const e = require('express');

exports.getAllScreams = (request, response) => {
    db
        .collection('screams')
        .orderBy('createdAt', 'asc')
        .get()
        .then((data) => {
            let screams = [];
            data.forEach((doc) => {
                screams.push({
                    screamID: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return response.json(screams)
        })
        .catch(err => console.error(err))

}

exports.postScream = (request, response) => {

    if (request.body.body.trim() === "") {
        return response.status(400).json({ body: "Body must not be empty" })
    }

    const newScream = {
        userHandle: request.user.handle,
        body: request.body.body,
        userImage: request.user.imageUrl,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0
    };

    db
        .collection('screams')
        .add(newScream)
        .then((doc) => {
            const resScream = newScream;
            resScream.screamId = doc.id
            response.json({ message: `document ${doc.id} created Successfully` })
        })
        .catch((err) => {
            response.status(500).json({ error: `something went wrong` });
            console.error(err);
        })
}

exports.getScream = (request, response) => {
    let scream = {};
    db.doc(`/screams/${request.params.screamId}`).get()
        .then((data) => {
            if (!data.exists) {
                return response.status(404).json({ error: "screams not found" })
            }
            scream = data.data();
            scream.screamId = data.id;
            return db
                .collection('comments')
                .orderBy('createdAt', 'asc')
                .where("screamId", "==", request.params.screamId)
                .get();
        })
        .then((data) => {
            scream.comments = [];
            data.forEach((doc) => {
                scream.comments.push(doc.data());
            });
            return response.json(scream);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err })
        })
}

exports.getCommentOnScream = (request, response) => {
    db
        .collection('comments')
        .where("screamId", "==", request.params.screamId)
        .get()
        .then((data) => {
            let comment = [];
            data.forEach((data) => {
                comment.push({
                    body: data.data().body,
                    createdAt: data.data().createdAt,
                    screamId: data.data().screamId,
                    userHandle: data.data().userHandle

                })
                console.log(data.data().screamId)
            }
            )

            return response.json(comment);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err })
        })
}

exports.commentOnScream = (request, response) => {
    if (request.body.body.trim() === '') return response.status(400).json({ error: "Comment must not be empty" })
    const newComment = {
        body: request.body.body,
        createdAt: new Date().toISOString(),
        screamId: request.params.screamId,
        userHandle: request.user.handle,
        userImage: request.user.imageUrl
    };

    db.doc(`/screams/${request.params.screamId}`)
        .get()
        .then((data) => {
            if (!data.exists) {
                return response.status(400).json({ Error: 'Scream does not exist' })
            }
            return db.collection('comments')
                .add(newComment);
        })
        .then((doc) => {
            return response.status(200).json({ comment: `Comment has been added` })
        })
        .catch((error) => {
            console.error(error);
            return response.status(500).json({ error: err });
        })
}

exports.likeScream = (request, response) => {

}

exports.unlikeScream = (request, response) => {

}