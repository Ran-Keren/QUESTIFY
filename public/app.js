import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC33dWyXuymE8GG-Jgxq7KVFiolMYP7To4",
    authDomain: "questify-3c0d7.firebaseapp.com",
    databaseURL: "https://questify-3c0d7-default-rtdb.firebaseio.com",
    projectId: "questify-3c0d7",
    storageBucket: "questify-3c0d7.firebasestorage.app",
    appId: "1:376123638900:web:f1bc6238df32b499cf3d21"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let startTime = 0;

// The mapping based on your shared DB structure
const squareMap = {
    "1": "sq1",
    "2": "sq2",
    "3": "sq3",
    "4": "sq4",
    "5": "sq5",
    "v7b44": "sq4" 
};

// Listen to the ROOT of the database
onValue(ref(db), (snapshot) => {
    const data = snapshot.val();
    console.log("Firebase Data Received:", data); // Check this in F12 Console

    if (!data) return;

    // Set startTime from the root
    startTime = data.startTime || 0;

    // Update squares
    if (data.squares) {
        Object.entries(squareMap).forEach(([dbKey, htmlId]) => {
            const el = document.getElementById(htmlId);
            if (el) {
                const isActive = data.squares[dbKey] === true;
                if (isActive) el.classList.add('active');
                else el.classList.remove('active');
            }
        });
    }
}, (error) => {
    console.error("Firebase Error:", error);
});

// Timer update loop
setInterval(() => {
    if (!startTime || startTime === 0) return;
    
    const now = Date.now();
    const diff = now - startTime;
    
    if (diff < 0) return;

    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    
    document.getElementById('timer').innerText = `${h}:${m}:${s}`;
}, 1000);