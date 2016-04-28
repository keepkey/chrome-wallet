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

chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    console.log("External message:", request.messageType);
    switch (request.messageType) {
      case 'ping':
        sendResponse({messageType: "PingResponse"});
        break;
    }
  }
);

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("Internal message:", request.messageType);
    switch (request.messageType) {
      case 'OpenInWindow':
        chrome.windows.create({
          type: 'popup',
          url: defaultPopup,
          width: 342,
          height: 390
        }, function (w) {
          popupId = w.id;
          chrome.browserAction.setPopup({
            popup: ''
          });
        });
        break;
    }
  }
);

chrome.runtime.onConnect.addListener(function (port) {
  port.onDisconnect.addListener(function () {
    console.log('connection closed');
    chrome.runtime.sendMessage(
      config.keepkeyProxy.applicationId,
      {messageType: 'Cancel'}
    );

  });
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.windows.update(popupId, {focused: true});
});

chrome.windows.onRemoved.addListener(function (id) {
  if (popupId === id) {
    popupId = undefined;
    chrome.browserAction.setPopup({
      popup: defaultPopup
    });
  }
});
