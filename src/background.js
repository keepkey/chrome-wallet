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
