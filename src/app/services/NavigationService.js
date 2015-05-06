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
            .when('/initializing', {
                templateUrl: 'app/initializing/initializing.tpl.html'
            })
            .when('/creating', {
                templateUrl: 'app/creating/creating.tpl.html'
            })
            .when('/walletlist', {
                templateUrl: 'app/walletlist/walletlist.tpl.html'
            })
            .when('/wallet', {
                templateUrl: 'app/wallet/wallet.tpl.html'
            })
            .when('/send', {
                templateUrl: 'app/send/send.tpl.html'
            })
            .when('/sending', {
                templateUrl: 'app/sending/sending.tpl.html'
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
            .when('/label', {
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
            return {
                go: function (path, pageAnimationClass) {

                    console.log('navigating to %s', path);

                    if (path === $location.path()) {
                        return;
                    }

                    if (typeof(pageAnimationClass) === 'undefined') { // Use a default, your choice
                        $rootScope.pageAnimationClass = '';
                    } else { // Use the specified animation
                        $rootScope.pageAnimationClass = pageAnimationClass;
                    }

                    $location.path(path);
                }
            };
        }
    ])
    .run(['$rootScope', 'NavigationService',
        function($rootScope, nav) {
            $rootScope.go = nav.go;
        }
    ]);
