const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://api-with-firebase.firebaseio.com"
});

// configura db
const db = admin.firestore();

// busca todos
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

// salva todo
exports.saveTodo = functions.https.onRequest(async (request, response) => {
  if (request.method !== 'POST') {
    response.status(403);
  }

  response.set('Access-Control-Allow-Origin', '*');

  try {
    const docRef = await db.collection('todos').add(request.body);
    response.status(200).json({ id: docRef.id });

  } catch(e) {
    response.status(500).json({ error: e });
  }
});
