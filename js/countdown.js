document.addEventListener("DOMContentLoaded", function() {
    const updateText = document.getElementById("update-text");

    // Target waktu: 11 Oktober 2025, jam 10:00 WIB
    const targetTime = new Date("2025-10-09T10:00:00+07:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetTime - now;

        if (diff <= 0) {
            // Kalau sudah waktunya
            updateText.textContent = "Update ON: 09-Okt-2025";
            updateText.classList.add("animate-bounce");
            clearInterval(timer);
            return;
        }

        // Hitung sisa waktu
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format hasil
        let formatted = "";
        if (days > 0) {
            formatted += `${days}d `;
        }
        formatted += 
            String(hours).padStart(2, "0") + ":" +
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

        updateText.textContent = `Update in: ${formatted}`;
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
});