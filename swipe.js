var lastSwipe = 0;
var sensitivity = 25;
var counterLeft = 0;
var counterRight = 0;

window.addEventListener("wheel", event => {
    const delta = Math.sign(event.deltaX);
    if (Date.now() - lastSwipe > 3000 && delta < 0) {
        if (counterRight > sensitivity) {
            window.history.back();
            lastSwipe = Date.now();
        }
        counterRight++;
    }
    if (Date.now() - lastSwipe > 3000 && delta > 0) {
        if (counterLeft > sensitivity) {
            window.history.forward();
            lastSwipe = Date.now();
        }
        counterLeft++;
    }
});
