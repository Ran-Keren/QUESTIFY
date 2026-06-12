<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Questify</title>
    <script type="module">
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
        let winTriggered = false;

        const squareMap = {
            "x9j22": "sq1",
            "p5k88": "sq2",
            "m3q11": "sq3",
            "v7b44": "sq4",
            "r2n99": "sq5"
        };

        // Listen to Firebase changes
        onValue(ref(db), (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            startTime = data.startTime || 0;

            // Reset win trigger if game was reset
            if (startTime === 0) {
                winTriggered = false;
            }

            let activeCount = 0;

            // Sync Squares
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

            // Trigger Win Sequence (only once)
            if (activeCount === 5 && !winTriggered) {
                winTriggered = true;
                startSolitaire();
                
                // Optional: You can still notify Firebase that the game was won
                // update(ref(db), { game_state: "won" });
            }
        });

        // Timer runs continuously (no stopTime anymore)
        setInterval(() => {
            const timerElement = document.getElementById('timer');
            if (!timerElement) return;

            if (!startTime || startTime === 0) {
                timerElement.innerText = "00:00:00";
                return;
            }

            const diff = Date.now() - startTime;

            const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
            const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
            const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');

            timerElement.innerText = `${h}:${m}:${s}`;
        }, 1000);

        // ==================== SOLITAIRE WIN ANIMATION ====================
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
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2,
                        vx: (Math.random() - 0.5) * 12,
                        vy: Math.random() * -8 - 6,
                        size: rect.width * 0.8
                    });
                }
            });

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach(p => {
                    ctx.fillStyle = '#00ff88';
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 3;
                    ctx.strokeRect(p.x, p.y, p.size, p.size);

                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.5; // gravity
                    p.vx *= 0.99;

                    if (p.y + p.size > window.innerHeight) {
                        p.y = window.innerHeight - p.size;
                        p.vy *= -0.7;
                    }
                    if (p.x < 0 || p.x + p.size > window.innerWidth) {
                        p.vx *= -0.8;
                    }
                });

                animationId = requestAnimationFrame(animate);
            }

            animate();

            // Remove after 10 seconds
            setTimeout(() => {
                cancelAnimationFrame(animationId);
                canvas.remove();
            }, 10000);
        }
    </script>

    <style>
        body {
            margin: 0;
            background: black;
            color: #00ff88;
            font-family: monospace;
            text-align: center;
        }
        #timer {
            font-size: 3rem;
            margin: 20px;
        }
        /* Add your square styles here */
        .square {
            width: 100px;
            height: 100px;
            background: #222;
            display: inline-block;
            margin: 10px;
            transition: all 0.3s;
        }
        .square.active {
            background: #00ff88;
            box-shadow: 0 0 20px #00ff88;
        }
    </style>
</head>
<body>
    <h1>Questify</h1>
    <div id="timer">00:00:00</div>

    <!-- Your squares -->
    <div id="sq1" class="square"></div>
    <div id="sq2" class="square"></div>
    <div id="sq3" class="square"></div>
    <div id="sq4" class="square"></div>
    <div id="sq5" class="square"></div>

</body>
</html>
