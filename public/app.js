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

// Exact mapping to match your Firebase keys
const squareMap = {
    "x9j22": "sq1",
    "p5k88": "sq2",
    "m3q11": "sq3",
    "v7b44": "sq4",
    "r2n99": "sq5"
};

// Main logic wrapped to ensure the page is ready
window.onload = () => {
    const timerElement = document.getElementById('timer');

    onValue(ref(db), (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // Sync startTime from root
        startTime = data.startTime || 0;

        // Sync squares from the /squares/ folder
        if (data.squares) {
            Object.keys(squareMap).forEach((secretKey) => {
                const htmlId = squareMap[secretKey];
                const el = document.getElementById(htmlId);
                if (el) {
                    const isActive = data.squares[secretKey] === true;
                    if (isActive) {
                        el.classList.add('active');
                    } else {
                        el.classList.remove('active');
                    }
                }
            });
        }
    });

    // Precision Timer
    setInterval(() => {
        if (!timerElement || !startTime || startTime === 0) return;

        const diff = Date.now() - startTime;
        if (diff < 0) return;

        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        
        timerElement.innerText = `${h}:${m}:${s}`;
    }, 1000);
};