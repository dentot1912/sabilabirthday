interact('.draggable').draggable({
    inertia: {
    resistance: 30, // lebih smooth
    minSpeed: 50,
    endSpeed: 5
    },
    autoScroll: true, // support drag sambil scroll
    modifiers: [
    interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
    })
    ],
    listeners: {
    move (event) {
        let target = event.target;
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform =
        `translate(${x}px, ${y}px) rotate(${target.getAttribute('data-rotate') || 0}deg)`;

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
    }
});

// Rotasi random biar aesthetic
document.querySelectorAll('.draggable').forEach(el => {
    let rotate = (Math.random() * 20) - 10; // -10 sampai 10 derajat
    el.setAttribute('data-rotate', rotate);
    el.style.transform = `rotate(${rotate}deg)`;
});