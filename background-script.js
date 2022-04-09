/*
Initialize default settings using browser.storage.local.
*/
const gettingItems = browser.storage.local.get();
gettingItems.then(onGot, onError);

function onGot(item) {
    if (item.default_values_initialized != true) {
        browser.storage.local.set({
            sensitivity: "100",
            default_values_initialized: true,
            developermode: false
        });
    }
}

function onError(error) {
    console.log(`Error: ${error}`);
}
let lastSwipe = 0;
function handleMessage(message,sender, sendResponse) {
	if(message=="ask date"){
        console.log("lastSwipe asked")
		sendResponse(lastSwipe);
	}else{ //content script telling us the date of swipe at any tab //
        console.log("new lastSwipe")
		lastSwipe = message;
	}
}
browser.runtime.onMessage.addListener(handleMessage);
