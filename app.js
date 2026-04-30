import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase Configuration
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

// Mapping secret keys to the visual squares
const squareMap = {
    "x9j22": "sq1",
    "p5k88": "sq2",
    "m3q11": "sq3",
    "v7b44": "sq4",
    "r2n99": "sq5"
};

// Listen for Real-time Updates
onValue(ref(db), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    startTime = data.startTime || 0;

    for (const [secretKey, squareId] of Object.entries(squareMap)) {
        const el = document.getElementById(squareId);
        const isActive = data.squares && data.squares[secretKey] === true;
        
        if (isActive) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    }
});

// Timer logic loop
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