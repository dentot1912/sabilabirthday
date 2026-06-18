const canvas = document.getElementById("star-bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Tentukan jumlah love sesuai ukuran layar
function getHeartCount() {
    if (window.innerWidth < 600) return 10;  // HP
    if (window.innerWidth < 1200) return 25; // Tablet
    return 60;                               // Laptop/PC
}

let hearts = [];
function initHearts() {
    hearts = Array.from({ length: getHeartCount() }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 6 + Math.random() * 10,
        speed: 0.3 + Math.random() * 0.4,
        drift: Math.random() * 0.6 - 0.3,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: 0.005 + Math.random() * 0.015
    }));
}
initHearts();

function drawHeart(h) {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(h.angle);

    const gradient = ctx.createRadialGradient(0, 0, h.size * 0.2, 0, 0, h.size);
    gradient.addColorStop(0, "rgba(255,255,255,0.95)"); // hot pink
    gradient.addColorStop(1, "rgba(255,255,255,0.5)");   // deeper pink

    ctx.fillStyle = gradient;
    ctx.beginPath();

    // Bentuk hati ❤️ pakai bezier curve
    const s = h.size;
    ctx.moveTo(0, -s / 2);
    ctx.bezierCurveTo(s, -s * 1.5, s * 1.5, s / 3, 0, s);
    ctx.bezierCurveTo(-s * 1.5, s / 3, -s, -s * 1.5, 0, -s / 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hearts.forEach(h => {
        drawHeart(h);
        h.y += h.speed;
        h.x += h.drift;
        h.angle += h.rotationSpeed;

        if (h.y > canvas.height + 20) {
            h.y = -20;
            h.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(animate);
}
animate();

// Re-init love saat resize
window.addEventListener("resize", () => {
    resize();
    initHearts();
});
