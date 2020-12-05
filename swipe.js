let lastSwipe = 0;

/*
Get the currently selected settings using browser.storage.local.
*/
const gettingItems = browser.storage.local.get();
gettingItems.then(onGot, onError);

function onGot(retrieveSettings) {
    sensitivity = retrieveSettings.sensitivity;
}

function onError(error) {
    console.log(`Error: ${error}`);
}

/*
Swipe logic.
*/
window.addEventListener("wheel", event => {
    if (Date.now() - lastSwipe > 500 && event.deltaX < -sensitivity) {
        window.history.back();
        lastSwipe = Date.now();
    }
    if (Date.now() - lastSwipe > 500 && event.deltaX > sensitivity) {
        window.history.forward();
        lastSwipe = Date.now();
    }
});
