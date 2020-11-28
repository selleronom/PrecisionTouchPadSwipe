var lastSwipe = 0;

window.addEventListener("wheel", event => {
    if (Date.now() - lastSwipe > 3000 && event.deltaX < -2) {
        window.history.back();
        lastSwipe = Date.now();
    }
    if (Date.now() - lastSwipe > 3000 && event.deltaX > 2) {
        window.history.forward();
        lastSwipe = Date.now();
    }
});
