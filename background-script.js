/*
Initialize default settings using browser.storage.local.
*/
const gettingItems = browser.storage.local.get();
gettingItems.then(onGot, onError);

function onGot(item) {
    if (item.default_values_initialized != true) {
        browser.storage.local.set({
            sensitivity: "100",
            default_values_initialized: true
        });
    }
}

function onError(error) {
    console.log(`Error: ${error}`);
}
