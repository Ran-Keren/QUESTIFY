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

    // Trigger Win Sequence
    if (activeCount === 5 && !winTriggered) {
        winTriggered = true;
        startSolitaire();
        setTimeout(() => {
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        }, 6000); 
    }
});

function startSolitaire() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    
    // Create origin points from actual square positions
    Object.values(squareMap).forEach(id => {
        const rect = document.getElementById(id).getBoundingClientRect();
        particles.push({
            x: rect.left,
            y: rect.top,
            vx: (Math.random() - 0.5) * 10,
            vy: Math.random() * -5 - 5, // Initial jump up
            size: rect.width
        });
    });

    function animate() {
        // We don't clear the whole canvas to get the "stacking" effect[cite: 3]
        particles.forEach(p => {
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.size, p.size);

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.4; // Gravity

            // Bounce logic for bottom of screen[cite: 3]
            if (p.y + p.size > window.innerHeight) {
                p.y = window.innerHeight - p.size;
                p.vy *= -0.75;
                // Add new variation after bounce
                p.vx += (Math.random() - 0.5) * 2;
            }
            
            // Screen edge bounce
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