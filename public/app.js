import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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
let stopTime = 0; 
let winTriggered = false;

const squareMap = {
    "x9j22": "sq1", "p5k88": "sq2", "m3q11": "sq3", "v7b44": "sq4", "r2n99": "sq5"
};

onValue(ref(db), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    startTime = data.startTime || 0;
    
    // 1. COUNT SQUARES FIRST
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

    // 2. CHECK WIN CONDITION & STOP TIME
    if (activeCount === 5) {
        // Only look at the database stopTime if we actually have all 5 squares
        stopTime = data.stopTime || 0; 

        if (!winTriggered) {
            winTriggered = true;
            
            // If stopTime is 0, this is the exact moment they just won
            if (stopTime === 0) {
                stopTime = Date.now();
                
                // Save it to Firebase so the clock stays frozen
                update(ref(db), { stopTime: stopTime });
                
                // Play the Solitaire effect
                startSolitaire(); 
            }
        }
    } else {
        // If we DO NOT have 5 squares, ignore any stopTime in the database
        // and force the local stopTime to 0 so the clock keeps ticking.
        stopTime = 0;
        winTriggered = false; 
    }
});

// --- TIMER LOOP ---
setInterval(() => {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;

    if (!startTime || startTime === 0) {
        timerElement.innerText = "00:00:00";
        return;
    }
    
    // If stopTime > 0 (meaning you have 5 squares), it freezes. Otherwise, it uses Date.now().
    const now = stopTime > 0 ? stopTime : Date.now(); 
    const diff = now - startTime;
    
    const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    
    timerElement.innerText = `${h}:${m}:${s}`;
}, 1000);

// --- SOLITAIRE FUNCTION ---
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
    let animationId; 
    
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
        particles.forEach(p => {
            ctx.fillStyle = '#00ff88';
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(p.x, p.y, p.size, p.size);

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.4; // Gravity

            if (p.y + p.size > window.innerHeight) {
                p.y = window.innerHeight - p.size;
                p.vy *= -0.75;
                p.vx += (Math.random() - 0.5) * 2;
            }
            
            if (p.x < 0 || p.x + p.size > window.innerWidth) p.vx *= -1;
        });
        animationId = requestAnimationFrame(animate);
    }
    
    animate();

    // Kills the animation exactly 10 seconds after it starts
    setTimeout(() => {
        cancelAnimationFrame(animationId);
        canvas.remove();
    }, 10000);
}

