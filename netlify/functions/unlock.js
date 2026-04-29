const admin = require('firebase-admin');

exports.handler = async (event) => {
  console.log("Function started for ID:", event.queryStringParameters.id);

  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: "https://questify-3c0d7-default-rtdb.firebaseio.com"
      });
      console.log("Firebase Admin Initialized");
    } catch (e) {
      console.error("Initialization Error:", e.message);
      return { statusCode: 500, body: "Init Error: " + e.message };
    }
  }

  const { id } = event.queryStringParameters;
  if (!id) return { statusCode: 400, body: "Missing ID" };

  try {
    const db = admin.database();
    await db.ref(`squares/${id}`).set(true);
    console.log("Square updated successfully");
    return { statusCode: 200, body: JSON.stringify({ status: "SUCCESS" }) };
  } catch (error) {
    console.error("Database Error:", error.message);
    return { statusCode: 500, body: "DB Error: " + error.toString() };
  }
};
