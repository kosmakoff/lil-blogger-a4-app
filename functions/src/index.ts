// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
import { DeltaSnapshot } from 'firebase-functions/lib/providers/database';
import { Event } from 'firebase-functions';

// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

const createUpdateArticleHandler = (event: Event<DeltaSnapshot>) => {
    const articleId = event.params.pushId;
    const userId = event.data.val().uid;

    const data = event.data.val();

    return admin.database().ref(`user-articles/${userId}/${articleId}`).set(data);
};

exports.onAddArticle = functions.database.ref('/articles/{pushId}').onCreate(createUpdateArticleHandler);
exports.onUpdateArticle = functions.database.ref('/articles/{pushId}').onUpdate(createUpdateArticleHandler);

exports.onDeleteArticle = functions.database.ref('/articles/{pushId}').onDelete(event => {
    const articleId = event.params.pushId;
    const userId = event.data.previous.val().uid;

    return admin.database().ref(`user-articles/${userId}/${articleId}`).remove();
});

exports.onUserAccountCreated = functions.auth.user().onCreate(event => {
    const userRecord = event.data;

    return admin.database().ref(`users/${userRecord.uid}`).set({
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL
    });
});

exports.onUserAccountCreated = functions.auth.user().onDelete(event => {
    const userRecord = event.data;

    return admin.database().ref(`users/${userRecord.uid}`).remove();
});
