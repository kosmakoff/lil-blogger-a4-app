// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';

// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

// Updates counter for Articles
exports.updateArticlesCounter = functions.database.ref('/articles/{pushId}').onWrite(event => {
    const isNew = event.data.exists() && !event.data.previous.exists();
    const isDelete = !event.data.exists() && event.data.previous.exists();

    const countRef = admin.database().ref('counters/articles');

    return countRef.transaction(current => {
        if (isNew) {
            return (current || 0) + 1;
        } else if (isDelete) {
            return (current || 0) - 1;
        } else {
            return (current || 0);
        }
    });
});

// Handles user data storage
exports.onUserAccountCreated = functions.auth.user().onCreate(event => {
    const userRecord = event.data;

    const uid = userRecord.uid;
    const displayName = userRecord.displayName;

    return admin.database().ref(`users/${uid}`).set({
        displayName: displayName
    });
});

exports.onUserAccountDeleted = functions.auth.user().onDelete(event => {
    const userRecord = event.data;
    const uid = userRecord.uid;

    return admin.database().ref(`users/${uid}`).remove();
});
