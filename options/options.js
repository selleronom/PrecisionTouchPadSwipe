const sensitivityInput = document.querySelector("#sensitivity");
const sensitivityInputNumber = document.querySelector("#s")
const enableLogging = document.querySelector("#logging");

sensitivityInputNumber.innerText = sensitivityInput.value;
sensitivityInput.addEventListener("input", function(e){
	sensitivityInputNumber.innerText = sensitivityInput.value;
});


/*
Store the currently selected settings using browser.storage.local.
*/
function storeSettings() {
    browser.storage.local.set({
        sensitivity: sensitivityInput.value,
        developermode: enableLogging.checked
    });
}

/*
Update the options UI with the settings values retrieved from storage.
*/
function onGot(retrieveSettings) {
    sensitivityInput.value = retrieveSettings.sensitivity;
    enableLogging.checked = retrieveSettings.developermode;
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
document.addEventListener("blur", storeSettings);
