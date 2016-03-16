angular.module('kkWallet', [
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'xeditable',
  'monospaced.qrcode',
  'kkCommon',
  'ngMessages'
])

  .constant('VERSION', '{{VERSION}}')
  .config(['$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|bitcoin):/);
    }
  ])
  .run([function() {
    angular.element(document.querySelector('body'))
      .on('keydown', function(ev) {
        if (ev.ctrlKey && ev.which === 32) {
          chrome.runtime.sendMessage({
            messageType: 'OpenInWindow'
          });
        }
      });
  }]);
