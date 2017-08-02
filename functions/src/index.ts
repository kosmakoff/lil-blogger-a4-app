// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';

// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    console.log(`Request Query`, req.query);
    const original = req.query.text;

    if (original) {
        // Push the new message into the Realtime Database using the Firebase Admin SDK.
        admin.database().ref('/messages').push({ original: original }).then(snapshot => {
            // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
            res.redirect(303, snapshot.ref);
        });
    } else {
        res.status(400).send('Wrong request query :(');
    }
});
