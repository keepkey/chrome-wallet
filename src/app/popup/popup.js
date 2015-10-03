angular.module('kkWallet', [
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'xeditable',
  'monospaced.qrcode',
  'kkCommon'
])

  .constant('VERSION', '{{VERSION}}')
  .config(['$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|bitcoin):/);
    }
  ]);