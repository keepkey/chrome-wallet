/* global chrome */
var popupId;
var defaultPopup;

chrome.browserAction.getPopup({}, function(popup) {
  var trimLength = window.location.origin.length;
  defaultPopup = popup.substr(trimLength);
  console.log('default popup:', defaultPopup);
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
