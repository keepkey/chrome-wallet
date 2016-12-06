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

chrome.browserAction.onClicked.addListener(function () {
  launchApp();
});

function launchApp() {
  function getExtensionList() {
    return new Promise(function (resolve) {
      chrome.management.getAll(function (extensions) {
        resolve(extensions);
      });
    });
  }

  function proxyApplicationInstalled(extensions) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var extFound = false;
        extensions.forEach(function (ext) {
          if (ext.id === config.keepkeyProxy.applicationId) {
            if (ext.enabled) {
              chrome.management.launchApp(ext.id);
            }
            else {
              chrome.management.setEnabled(ext.id, true, function () {
                chrome.management.launchApp(ext.id);
              });
            }
            resolve(ext);
            extFound = true;
          }
        });
        if (!extFound) {
          reject();
        }
      }, 0);
    });
  }

  function closeForeignProxies(extensions) {
    return new Promise(function (resolve, reject) {
      chrome.management.getAll(function (extensions) {
        extensions.forEach(function (ext) {
          if (config.foreignKeepkeyProxies.indexOf(ext.id) !== -1) {
            if (ext.enabled) {
              chrome.management.setEnabled(ext.id, false);
            }
          }
        });
        resolve(extensions);
      });
    });

  }

  getExtensionList()
    .then(proxyApplicationInstalled)
    .then(closeForeignProxies)
    .catch(function loadProxyDownloadPage() {
      var keepKeyProxyUrl = "https://chrome.google.com/webstore/detail/" + config.keepkeyProxy.applicationId;
      chrome.tabs.create({url: keepKeyProxyUrl});
    });
}
