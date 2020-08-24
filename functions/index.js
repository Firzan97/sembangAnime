const { getAllScreams, postScream, getScream, getCommentOnScream, commentOnScream, likeScream, unlikeScream } = require('./handlers/screams')
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./util/users');
const { FBAuth } = require('./util/FBAuth')
const functions = require('firebase-functions');
const express = require('express');
const app = express();


// list all screams
app.get('/screams', getAllScreams);
//add new scream
app.post('/scream', FBAuth, postScream);
//view a scream & all its comment
app.get('/scream/:screamId', getScream);
//view all scream comment
app.get('/scream/:screamId/comment', FBAuth, getCommentOnScream);
app.post('/scream/:screamId/comment', FBAuth, commentOnScream);
app.get('/scream/:screamId/like', FBAuth, likeScream);
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream);

//user sign up
app.post('/signup', signup);
//user login
app.post('/login', login);
//user image
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
//https//baseurl.com/api/
exports.api = functions.https.onRequest(app);