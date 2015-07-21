angular.module('kkWallet', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'indexedDB',
    'xeditable',
    'monospaced.qrcode'])

    .constant('VERSION', '{{VERSION}}')
    .config( ['$compileProvider',
        function( $compileProvider )
        {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|bitcoin):/);
        }
    ]);