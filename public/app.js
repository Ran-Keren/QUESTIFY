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
let stopTime = 0; // Stores the time when all 5 squares are active
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
        stopTime = Date.now(); // Capture exact win time to freeze the clock
        startSolitaire(); 
        // Rickroll redirect removed here so the user can enjoy the animation and see their time!
    }
});

// Interval uses stopTime to freeze the clock
setInterval(() => {
    const timerElement = document.getElementById('timer');
    if (!timerElement || !startTime) return;
    
    const now = stopTime > 0 ? stopTime : Date.now(); 
    const diff = now - startTime;
    
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    timerElement.innerText = `${h}:${m}:${s}`;
}, 1000);

function startSolitaire() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    // Make sure the canvas sits behind the timer if the timer has a lower z-index, 
    // or just let it overlay but keep pointer-events: none so it doesn't block clicks.
    canvas.style.zIndex = '9999'; 
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    
    Object.values(squareMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            const rect = el.getBoundingClientRect();
            particles.push({
                x: rect.left,
                y: rect.top,
                vx: (Math.random() - 0.5) * 10,
                vy: Math.random() * -5 - 5,
                size: rect.width
            });
        }
    });

    function animate() {
        // Clear a slight trail or fully clear the rect if you don't want trails
        // This current implementation just draws infinitely which gives the "solitaire" trail effect
        particles.forEach(p => {
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.size, p.size);

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.4; // Gravity

            // Bounce off bottom
            if (p.y + p.size > window.innerHeight) {
                p.y = window.innerHeight - p.size;
                p.vy *= -0.75;
                p.vx += (Math.random() - 0.5) * 2;
            }
            
            // Bounce off sides
            if (p.x < 0 || p.x + p.size > window.innerWidth) p.vx *= -1;
        });
        requestAnimationFrame(animate);
    }
    animate();
}
