/* global chrome */

// Note: The config object is added to this file at build time

var popupId;
var defaultPopup;

if (config.environment !== 'prod') {
  chrome.browserAction.setBadgeText({text: config.environment});
  chrome.browserAction.setBadgeBackgroundColor({color: '#888'});
}

chrome.browserAction.getPopup({}, function (popup) {
  var trimLength = window.location.origin.length;
  defaultPopup = popup.substr(trimLength);
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("External message:", request.messageType);
    switch (request.messageType) {
      case 'ping':
        sendResponse({messageType: "PingResponse"});
        break;
    }
  }
);

chrome.runtime.onConnect.addListener(function (port) {
  port.onDisconnect.addListener(function () {
    console.log('connection closed');
    chrome.runtime.sendMessage({messageType: 'Cancel'});
  });
});

chrome.browserAction.onClicked.addListener(function (tab) {
  console.log('boo!');
  chrome.windows.update(popupId, {focused: true});
});
