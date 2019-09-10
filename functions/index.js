const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://api-with-firebase.firebaseio.com"
});

const db = admin.firestore();

// EXAMPLE
const todo = {
  title: 'Javascript é massa!',
  description: 'Estudar Javascript',
  color: 'Brown',
  status: 'DOING',
}

exports.getTodos = functions.https.onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');

  try {
    const snapshot = await db.collection('todos').get();

    response.status(200).json({
      todos: snapshot.docs.map((doc) => doc.data())
    });

  } catch(e) {
    response.status(500).json({ error: e });
  }
});
