const sensitivityInput = document.querySelector("#sensitivity");

/*
Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {
    browser.storage.local.set({
        sensitivity: sensitivityInput.value
    });
}

/*
Update the options UI with the settings values retrieved from storage.
*/
function onGot(retrieveSettings) {
    sensitivityInput.value = retrieveSettings.sensitivity;
}

function onError(error) {
    console.log(`Error: ${error}`);
}

/*
On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(onGot, onError);

/*
On blur, save the currently selected settings.
*/
sensitivityInput.addEventListener("blur", storeSettings);
