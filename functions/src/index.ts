// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';
import { DataSnapshot } from 'firebase-functions/lib/providers/database';

// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
import { EventContext } from 'firebase-functions';
import { getHeapSpaceStatistics } from 'v8';

function getApp() {
    const appOptions = JSON.parse(process.env.FIREBASE_CONFIG);
    const app = admin.initializeApp(appOptions);
    return app;
}

exports.onAddArticle = functions.database.ref('/articles/{pushId}').onCreate((snapshot, context) => {
    const articleId = context.params.pushId;
    const data = snapshot.val();
    const userId = data.uid;
    return getApp().database().ref(`user-articles/${userId}/${articleId}`).set(data);
});

exports.onUpdateArticle = functions.database.ref('/articles/{pushId}').onUpdate((change, context) => {
    const articleId = context.params.pushId;
    const data = change.after.val();
    const userId = data.uid;
    return getApp().database().ref(`user-articles/${userId}/${articleId}`).set(data);
});

exports.onDeleteArticle = functions.database.ref('/articles/{pushId}').onDelete((snapshot, context) => {
    const articleId = context.params.pushId;
    const userId = snapshot.val().uid;

    return getApp().database().ref(`user-articles/${userId}/${articleId}`).remove();
});

exports.onUserAccountCreated = functions.auth.user().onCreate((user, context) => {
    return getApp().database().ref(`users/${user.uid}`).set({
        displayName: user.displayName,
        photoURL: user.photoURL
    });
});

exports.onUserAccountDeleted = functions.auth.user().onDelete((user, context) => {
    return getApp().database().ref(`users/${user.uid}`).remove();
});
