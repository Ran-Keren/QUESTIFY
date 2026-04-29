const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: "https://questify-3c0d7-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();

exports.handler = async (event) => {
  const { id } = event.queryStringParameters;
  if (!id) return { statusCode: 400, body: "Missing ID" };

  try {
    const sqRef = db.ref(`squares/${id}`);
    const snapshot = await sqRef.get();

    if (snapshot.val() === true) {
      return { statusCode: 200, body: JSON.stringify({ status: "ALREADY_USED" }) };
    }

    await sqRef.set(true);

    const timeRef = db.ref('startTime');
    const timeSnap = await timeRef.get();
    if (!timeSnap.val() || timeSnap.val() === 0) {
      await timeRef.set(Date.now());
    }

    return { statusCode: 200, body: JSON.stringify({ status: "SUCCESS" }) };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};
