let lastSwipe = 0;
let sensitivity = 0;
/*
Get the currently selected settings using browser.storage.local.
*/
let gettingItems = chrome.storage.local.get();
gettingItems.then(onGot, onError);

function onGot(retrieveSettings) {
    sensitivity = retrieveSettings.sensitivity;
    continueCode();
}

function onError(error) {
    console.log(`Error: ${error}`);
}
/*
Swipe logic.
*/
function continueCode() {
    window.addEventListener("wheel", event => {
        if (Date.now() - lastSwipe > 1000 && (event.deltaX < -sensitivity || event.deltaX > sensitivity)) {
            if (event.deltaX < 0) {
                window.history.back();
            }
            if (event.deltaX > 0) {
                window.history.forward();
            }
            lastSwipe = Date.now();
        }
    });
}
