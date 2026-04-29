const admin = require('firebase-admin');

exports.handler = async (event) => {
  // 1. Initialize Firebase Admin (The Master Key)
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // This line fixes the formatting of the private key automatically
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: "https://questify-3c0d7-default-rtdb.firebaseio.com"
      });
    } catch (e) {
      return { statusCode: 500, body: "Init Error: " + e.message };
    }
  }

  const db = admin.database();
  const { id } = event.queryStringParameters;

  if (!id) return { statusCode: 400, body: "Missing ID" };

  try {
    const sqRef = db.ref(`squares/${id}`);
    const snapshot = await sqRef.get();

    // 2. Check if already green
    if (snapshot.val() === true) {
      return { 
        statusCode: 200, 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ALREADY_USED" }) 
      };
    }

    // 3. Set the square to true
    await sqRef.set(true);

    // 4. Start the timer if this is the first square
    const timeRef = db.ref('startTime');
    const timeSnap = await timeRef.get();
    if (!timeSnap.val() || timeSnap.val() === 0) {
      await timeRef.set(Date.now());
    }

    return { 
      statusCode: 200, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SUCCESS" }) 
    };

  } catch (error) {
    return { statusCode: 500, body: "Database Error: " + error.toString() };
  }
};
