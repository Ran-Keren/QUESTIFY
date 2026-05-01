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
let winTriggered = false;

const squareMap = {
    "x9j22": "sq1", "p5k88": "sq2", "m3q11": "sq3", "v7b44": "sq4", "r2n99": "sq5"
};

onValue(ref(db), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    startTime = data.startTime || 0;
    let activeCount = 0;

    if (data.squares) {
        Object.entries(squareMap).forEach(([secretKey, htmlId]) => {
            const el = document.getElementById(htmlId);
            if (el) {
                const isActive = data.squares[secretKey] === true;
                el.classList.toggle('active', isActive);
                if (isActive) activeCount++;
            }
        });
    }

    // Solitaire Logic: If all 5 are green[cite: 3]
    if (activeCount === 5 && !winTriggered) {
        winTriggered = true;
        startSolitaire();
        setTimeout(() => {
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }, 5000); // Redirect after 5 seconds
    }
});

function startSolitaire() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: (window.innerWidth / 6) * (i + 1),
            y: window.innerHeight / 3,
            vx: Math.random() * 4 - 2,
            vy: 2,
            size: 60
        });
    }

    function animate() {
        particles.forEach(p => {
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(p.x, p.y, p.size, p.size);

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // Gravity

            if (p.y + p.size > window.innerHeight) {
                p.y = window.innerHeight - p.size;
                p.vy *= -0.8; // Bounce
            }
            if (p.x < 0 || p.x + p.size > window.innerWidth) p.vx *= -1;
        });
        requestAnimationFrame(animate);
    }
    animate();
}

setInterval(() => {
    const timerElement = document.getElementById('timer');
    if (!timerElement || !startTime) return;
    const diff = Date.now() - startTime;
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    timerElement.innerText = `${h}:${m}:${s}`;
}, 1000);