/* global chrome */
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

var popupId;

chrome.browserAction.onClicked.addListener(
  function(tab) {
    if (popupId) {
      chrome.windows.update(popupId, { focused:true });
    } else {
      chrome.windows.create({
        type: 'popup',
        url: '/popup.html',
        width: 360,
        height: 410
      }, function (w) {
        popupId = w.id;
      });
    }
  }
);

chrome.windows.onRemoved.addListener(function(id) {
  if (popupId === id) {
    popupId = undefined;
  }
});
