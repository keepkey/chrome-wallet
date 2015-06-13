angular.module('kkWallet')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/connect/connect.tpl.html'
            })
            .when('/connect', {
                templateUrl: 'app/connect/connect.tpl.html'
            })
            .when('/initialize', {
                templateUrl: 'app/initialize/initialize.tpl.html'
            })
            .when('/initialized', {
                templateUrl: 'app/initialized/initialized.tpl.html'
            })
            .when('/bootloader', {
                templateUrl: 'app/bootloader/bootloader.tpl.html'
            })
            .when('/buttonRequest/ButtonRequest_ConfirmWord', {
                templateUrl: 'app/buttonRequest/confirmWord.tpl.html'
            })
            .when('/buttonRequest/ButtonRequest_WipeDevice', {
                templateUrl: 'app/buttonRequest/wipeDevice.tpl.html'
            })
            .when('/buttonRequest/ButtonRequest_FirmwareErase', {
                templateUrl: 'app/buttonRequest/firmwareErase.tpl.html'
            })
            .when('/buttonRequest/:code', {
                templateUrl: 'app/buttonRequest/buttonRequest.tpl.html'
            })
            .when('/characterRequest/:word_pos/:character_pos', {
                templateUrl: 'app/characterRequest/characterRequest.tpl.html'
            })
            .when('/creating', {
                templateUrl: 'app/creating/creating.tpl.html'
            })
            .when('/failure', {
                templateUrl: 'app/failure/failure.tpl.html'
            })
            .when('/walletlist', {
                templateUrl: 'app/walletlist/walletlist.tpl.html'
            })
            .when('/wallet', {
                templateUrl: 'app/wallet/wallet.tpl.html'
            })
            .when('/wordRequest', {
                templateUrl: 'app/wordRequest/wordRequest.tpl.html'
            })
            .when('/send', {
                templateUrl: 'app/send/send.tpl.html'
            })
            .when('/sending', {
                templateUrl: 'app/sending/sending.tpl.html'
            })
            .when('/success/FirmwareErased', {
                templateUrl: 'app/success/firmwareErased.tpl.html'
            })
            .when('/success/Uploadcomplete', {
                templateUrl: 'app/success/uploadComplete.tpl.html'
            })
            .when('/success/:message', {
                templateUrl: 'app/success/success.tpl.html'
            })
            .when('/receive', {
                templateUrl: 'app/receive/receive.tpl.html'
            })
            .when('/pin/:type', {
                templateUrl: 'app/pin/pin.tpl.html'
            })
            .when('/passphrase', {
                templateUrl: 'app/passphrase/passphrase.tpl.html'
            })
            .when('/label/:nextAction', {
                templateUrl: 'app/label/label.tpl.html'
            })
            .when('/syncing', {
                templateUrl: 'app/syncing/syncing.tpl.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .factory('NavigationService', ['$location', '$rootScope',
        function ($location, $rootScope) {
            var nextTransition;
            return {
                go: function (path, pageAnimationClass) {

                    if (path === $location.path()) {
                        return;
                    }

                    if (typeof(pageAnimationClass) !== 'undefined') {
                        $rootScope.pageAnimationClass = pageAnimationClass;
                    }
                    else if (typeof(nextTransition) !== 'undefined') {
                        $rootScope.pageAnimationClass = nextTransition;
                    }
                    else {
                        $rootScope.pageAnimationClass = '';
                    }
                    console.log('navigating to %s with "%s" transition', path, $rootScope.pageAnimationClass);
                    nextTransition = undefined;
                    $location.path(path);
                },
                setNextTransition: function(pageAnimationClass) {
                    nextTransition = pageAnimationClass;
                }
            };
        }
    ])
    .run(['$rootScope', 'NavigationService',
        function($rootScope, navigationService) {
            $rootScope.go = navigationService.go;
        }
    ]);
