import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your Firebase Configuration
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

// Updated Map to match your database keys (1, 2, 3, 4, 5 and v7b44)
const squareMap = {
    "1": "sq1",
    "2": "sq2",
    "3": "sq3",
    "4": "sq4",
    "5": "sq5",
    "v7b44": "sq4" // Matches your specific database entry
};

// Listen for Real-time Updates from Firebase
onValue(ref(db), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // Sync startTime for the timer
    startTime = data.startTime || 0;

    // Sync Squares based on your database keys
    for (const [key, squareId] of Object.entries(squareMap)) {
        const el = document.getElementById(squareId);
        if (!el) continue;

        const isActive = data.squares && data.squares[key] === true;
        
        if (isActive) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    }
});

// Timer Logic
setInterval(() => {
    if (startTime === 0) {
        document.getElementById('timer').innerText = "00:00:00";
        return;
    }
    
    const diff = Date.now() - startTime;
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    
    document.getElementById('timer').innerText = `${h}:${m}:${s}`;
}, 1000);