var lastSwipe = 0;
window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaX);

    if (Date.now() - lastSwipe > 3000 && delta < 0) {
        window.history.back();
        lastSwipe = Date.now();
    }
    if (Date.now() - lastSwipe > 3000 && delta > 0) {
        window.history.forward();
        lastSwipe = Date.now();
    }
});