let sensitivity = 0;
let eventData; //needed as continueCode is split into two parts and handleResponse needs access to event data
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
function handleResponse(message) {
	 //message retrieved from the background script
	if(Date.now() - message > 1000){
		if (eventData.deltaX < 0) {
		//interestingly, if I put this (window.history.back();) statement 6 times in a row in the Devtools Console, it always goes back only one page
		//so the bug is probably caused by this event capturing two times: to navigate AND during navigation
		//because it happens during navigation, the standart lastSwipe check does not work, because the variable are different in content scripts on ALL pages - the content script running on every page is original - meaning variable states don't persist with page loads //
		//proposed solution: communicate with the background script 			
		window.history.back(); 
		}
		if (eventData.deltaX > 0) {
		window.history.forward();
		}
	let sending = browser.runtime.sendMessage(Date.now()); //sending the last date the event was fired to date //
	}
}
function handleError(error) {
	console.log(error);
}
/*
Swipe logic.
*/
function continueCode() {
    window.addEventListener("wheel", event => { 
    	eventData = event;
        if (event.deltaX < -sensitivity || event.deltaX > sensitivity) {      	
        	let sending = browser.runtime.sendMessage("ask date");
 			sending.then(handleResponse, handleError);
    	}
    });
}
