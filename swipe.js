let lastSwipe = 0;
let sensitivity = 0;
var scrollingLeftOrRight = false; //initially console.log(window.scrollingLeftOrRight == undefined) evals as true when the declaration is let, so I changed it to var and strip the window. prefix from it (as var and window prefix don't work)
let originalSize = true;
var printingData = false; //for debugging
var FlipScrollingLeftOrRightAfter = 2000; //number of ms after which window.scrollingLeftOrRight is flipped to false
let eventData; //needed as continueCode is split into two parts and handleResponse needs access to event data
/*
Get the currently selected settings using browser.storage.local.
*/
//STRIPPED window prefix from scrollingLeftOrRight and changed the declaration to var
//for debugging
function print(text, style){
	if(printingData){
			if(style == "warn"){
				console.warn(text);
			}
			if(style == "error"){
				console.error(text);
			}else{
				console.log(text);
			}
	}
}
function applySettings(retrieveSettings){
    sensitivity = retrieveSettings.sensitivity;
    printingData = retrieveSettings.developermode;
    if(sensitivity == undefined){
    	sensitivity = 100;
    }
}
let gettingItems = chrome.storage.local.get();
gettingItems.then(onGot, onError);

function setData(){
	let gettingItems = chrome.storage.local.get();
	gettingItems.then(applySettings, onError);
}

browser.storage.onChanged.addListener(setData);

//DONE partially SOLVED: TODO: solve: find a way to register the element overscroll-x listeners on single page applications like github.com everytime the user navigates to the page because: after the eventlisteners for overscroll elements are unregistered after the element is unloaded after page navigation
//https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
var oldHref = document.location.href;
window.onload = function() {
    var bodyList = document.querySelector("body")
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                /* Changed ! your code here */
                //reregister scrollevents on elements which have overscroll-x
                let horizontalScrollElements = ElementsWithScrolls();
                print(horizontalScrollElements,"error");
								horizontalScrollElements.forEach(listenForScrollEvents);
            }
        });
    });
    var config = {
        childList: true,
        subtree: true
    };   
    observer.observe(bodyList, config);
};

function onGot(retrieveSettings) {
		print("settings loaded at new script load","warn");
		applySettings(retrieveSettings);
    continueCode();
}

function onError(error) {
    console.log(`Error: ${error}`);
}
function handleResponse(message){
	lastSwipe = message; //message retrieved from the background script
	print("message " + message);
	if(Date.now() - message > 1000){
		if (eventData.deltaX < 0) {
		//SOLVED: interestingly, if I put this (window.history.back();) statement 6 times in a row in the Devtools Console, it always goes back only one page
		//so the bug is probably caused by this event capturing two times: to navigate AND during navigation
		//because it happens during navigation, the standart lastSwipe check does not work, because the variable are different in content scripts on ALL pages - the content script running on every page is original - meaning variable states don't persist with page loads //
		//proposed solution: communicate with the background script 
			
		window.history.back(); 
		}
		if (eventData.deltaX > 0) {
		window.history.forward();
		}
		window.lastSwipe = Date.now();
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
    	print("event run");
			//print(scrollingLeftOrRight == undefined);
			let allowed = !scrollingLeftOrRight
			print("allowed " + allowed);
			print("scrollingLeftOrRight value " + scrollingLeftOrRight);

			if(scrollingLeftOrRight == false){ //replaced !scrollingLeftOrRight as that evaluated true when the let variable was undefined
				print("event.deltaX "+ event.deltaX);
				print("sensitivity "+ sensitivity);
				if (event.deltaX < -sensitivity || event.deltaX > sensitivity) {  
					print("conditions right");    	
			    	let sending = browser.runtime.sendMessage("ask date");
						sending.then(handleResponse, handleError);
				}
			}      
    });
}
//this is needed to allow horizontal scrolling on code examples on stackoverflow for example
//generally for elements with an x overflow (and thus a scrollbar)
//https://stackoverflow.com/questions/34532331/finding-all-elements-with-a-scroll
//https://stackoverflow.com/a/34700876
//note that this only works for elements not when the document itself has scrollbars
var ElementsWithScrolls = (function() {
    var getComputedStyle = document.body && document.body.currentStyle ? function(elem) {
        return elem.currentStyle;
    } : function(elem) {
        return document.defaultView.getComputedStyle(elem, null);
    };

    function getActualCss(elem, style) {
        return getComputedStyle(elem)[style];
    }

    function isXScrollable(elem) { //only x axis left to right is needed
        return elem.offsetWidth < elem.scrollWidth &&
            autoOrScroll(getActualCss(elem, 'overflow-x'));
    }

    function autoOrScroll(text) {
        return text == 'scroll' || text == 'auto';
    }

    function hasScroller(elem) {
    	return isXScrollable(elem);
        //return isYScrollable(elem) || isXScrollable(elem);
    }
    return function ElemenetsWithScrolls() {
        return [].filter.call(document.querySelectorAll('*'), hasScroller);
    };
})();
function setScrollingLeftOrRightFromElement(elem){ 
				print("flip","error"); //to make it graphically noticeable
				print(elem);
				if(elem.scrollLeftMax != elem.scrollLeft && elem.scrollLeft != 0){
					scrollingLeftOrRight = true;
				}else{
					scrollingLeftOrRight = false;
				}
		 	}
function listenForScrollEvents(elem, index, array) {
	elem.addEventListener("scroll",event => { 
		//if(elem.scrollLeftMax == elem.scrollLeft || elem.scrollLeft == 0) //navigate then
		if(elem.scrollLeftMax != elem.scrollLeft && elem.scrollLeft != 0){
			scrollingLeftOrRight = true;
			print("check works " + scrollingLeftOrRight);
		}else{
			print("d"); //runs exactly once
			//after initializing the FlipScrollingLeftOrRightAfter as var the window.FlipScrollingLeftOrRightAfter returns undefined and only FlipScrollingLeftOrRightAfter returns the right number,2000
			print("window.FlipScrollingLeftOrRightAfter "+ FlipScrollingLeftOrRightAfter); //returns undefined even though let FlipScrollingLeftOrRightAfter defined at global scope
			setTimeout(setScrollingLeftOrRightFromElement,FlipScrollingLeftOrRightAfter,elem); //In modern browsers (ie IE11 and beyond), the "setTimeout" receives a third parameter that is sent as parameter to the internal function at the end of the timer. https://stackoverflow.com/questions/1190642/how-can-i-pass-a-parameter-to-a-settimeout-callback

		}	
	});
	elem.addEventListener("mouseleave", event => {
		scrollingLeftOrRight = false; //otherwise navigating would be blocked
	});
}
//I have tested the speed of this function and it is around 2ms-25ms (stackoverflow.com), so no worries about performance //
//It is around 1ms for every element found
horizontalScrollElementsArray = ElementsWithScrolls();
//if I added an Event Listener on document, it would not fire when I scroll on an overflow div (but the wheel event would) the idea here is to allow users to scroll horizontally (overflow and panned elements),and to only navigate back on overscroll (scrolled) //
horizontalScrollElementsArray.forEach(listenForScrollEvents);

// //when the document has a scrollbar initially
function resizeHandler(e){
		print("scrollin")
		if(window.scrollX != 0 && window.scrollMaxX != window.scrollX){
				scrollingLeftOrRight = true;
		}else{
			print("allow in a second");
			setTimeout(function(){ 
				scrollingLeftOrRight = false;
			 },FlipScrollingLeftOrRightAfter);
		}
}
function scrollCheck(){
	if(document.body.scrollWidth > document.body.clientWidth){
	document.addEventListener("scroll",event => { 
		resizeHandler(event);
	});
	}
}
scrollCheck();
window.addEventListener("resize", scrollCheck);

visualViewport.addEventListener('scroll', function(event) { //this event fires always, even when the document is not panned
if(window.visualViewport.scale != 1){ //document is panned
	print("scale " + window.visualViewport.scale);
	print("window.visualViewport.pageLeft "+ window.visualViewport.pageLeft);
	//navigate if(window.visualViewport.pageLeft == 0 || window.visualViewport.pageLeft >= maxRight)
	//trying this new evaluation of the right side Math.abs(Math.round(window.visualViewport.pageLeft) - maxRight) > 1 because of rounding integers (sometimes window.visualViewport.pageLeft > maxRight)
	if(window.visualViewport.pageLeft == 0){ //Math.floor(window.visualViewport.pageLeft) < maxRight //Math.floor(window.visualViewport.pageLeft) < maxRight
			function setScrollingLeftOrRight(){
			// //TODO: solve scroll right left bug (to the right - unlock - to the left - navigates)
					if(window.visualViewport.pageLeft == 0){ //checking for position - if the viewport is in the midle of the page, scrolling is not allowd
							scrollingLeftOrRight = false;
							print("window scroll left or right flipped left");
					}else{
						scrollingLeftOrRight = true;
					}
			}
		setTimeout(setScrollingLeftOrRight, FlipScrollingLeftOrRightAfter); //one second is too small (tested)
	}else{ 

		let maxRight = Math.round(document.body.scrollWidth - window.visualViewport.width); //Math.floor //this method is pretty accurate (5pixels inaccurate at most)
		print("maxRight "+ maxRight);
		if (Math.abs(Math.round(window.visualViewport.pageLeft) - maxRight) < 1) { //right edge/
			//set the variable scrollingLeftOrRight after 1500ms if conditions o for it are met (the user hasn't moved the visualviewport from the edge after )
			function setScrollingLeftOrRight(){
					let maxRight = Math.round(document.body.scrollWidth - window.visualViewport.width);
					if(Math.abs(Math.round(window.visualViewport.pageLeft) - maxRight) < 1){ //checking for position - if the viewport is in the midle of the page, scrolling is not allowd
						scrollingLeftOrRight = false;
						print("window scroll left or right flipped right");
					}else{
						scrollingLeftOrRight = true;
					}
			}
			setTimeout(setScrollingLeftOrRight, FlipScrollingLeftOrRightAfter); //one second is too small (tested)
		
		}else{ //is scrolling
				scrollingLeftOrRight = true;
		}
		}
	}
});
