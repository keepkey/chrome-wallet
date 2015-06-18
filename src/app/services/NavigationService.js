angular.module('kkWallet')
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'app/connect/connect.tpl.html'
                })
                .when('/connect', {
                    templateUrl: 'app/connect/connect.tpl.html'
                })
                .when('/initialize', {
                    templateUrl: 'app/initialize/initialize.tpl.html',
                    goable:true
                })
                .when('/initialized', {
                    templateUrl: 'app/initialized/initialized.tpl.html',
                    goable: true
                })
                .when('/bootloader', {
                    templateUrl: 'app/bootloader/bootloader.tpl.html'
                })
                .when('/buttonRequest/button_request_confirm_word', {
                    templateUrl: 'app/buttonRequest/confirmWord.tpl.html',
                    goable: false
                })
                .when('/buttonRequest/button_request_wipe_device', {
                    templateUrl: 'app/buttonRequest/wipeDevice.tpl.html',
                    goable: false
                })
                .when('/buttonRequest/button_request_firmware_erase', {
                    templateUrl: 'app/buttonRequest/firmwareErase.tpl.html',
                    goable: false
                })
                .when('/buttonRequest/:code', {
                    templateUrl: 'app/buttonRequest/buttonRequest.tpl.html',
                    goable: false
                })
                .when('/characterRequest/:word_pos/:character_pos', {
                    templateUrl: 'app/characterRequest/characterRequest.tpl.html',
                    goable: false
                })
                .when('/creating', {
                    templateUrl: 'app/creating/creating.tpl.html'
                })
                .when('/failure/firmware_erase_cancelled', {
                    templateUrl: 'app/failure/firmwareEraseCancelled.tpl.html',
                    goable: false
                })
                .when('/failure/:message', {
                    templateUrl: 'app/failure/failure.tpl.html',
                    goable: false
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
                .when('/success/firmware_erased', {
                    templateUrl: 'app/success/firmwareErased.tpl.html',
                    goable: false
                })
                .when('/success/upload_complete', {
                    templateUrl: 'app/success/uploadComplete.tpl.html',
                    goable: false
                })
                .when('/success/:message', {
                    templateUrl: 'app/success/success.tpl.html',
                    goable: false
                })
                .when('/receive', {
                    templateUrl: 'app/receive/receive.tpl.html'
                })
                .when('/pin/:type', {
                    templateUrl: 'app/pin/pin.tpl.html',
                    goable: false
                })
                .when('/passphrase', {
                    templateUrl: 'app/passphrase/passphrase.tpl.html',
                    goable: false
                })
                .when('/label/:nextAction', {
                    templateUrl: 'app/label/label.tpl.html',
                    goable: true
                })
                .when('/syncing', {
                    templateUrl: 'app/syncing/syncing.tpl.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }])
    .factory('NavigationService', ['$location', '$rootScope', '$route',
        function ($location, $rootScope, $route) {
            var nextTransition, nextDestination, previousRoute = [];

            function isGoable(path) {
                var result = {
                    goable: false
                };

                // NOTE $route.routes is not defined in the API documentation
                angular.forEach($route.routes, function (value, key) {
                    if (value.regexp && path.match(value.regexp)) {
                        this.goable = this.goable || angular.isUndefined(value.goable) || value.goable;
                    }
                }, result);

                return result.goable;
            }

            return {
                go: function (path, pageAnimationClass) {

                    if (nextDestination) {
                        path = nextDestination;
                        nextDestination = undefined;
                    }

                    if (path === $location.path()) {
                        return;
                    }

                    // Keep track of the last 'goable' path
                    if (isGoable($location.path())) {
                        previousRoute = $location.path();
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
                    console.log('navigating from %s to %s with "%s" transition', previousRoute, path, $rootScope.pageAnimationClass);
                    nextTransition = undefined;

                    $location.path(path);
                },
                setNextTransition: function (pageAnimationClass) {
                    nextTransition = pageAnimationClass;
                },
                setNextDestination: function (destination) {
                    nextDestination = destination;
                },
                getPreviousRoute: function () {
                    return previousRoute;
                }
            };
        }
    ])
    .run(['$rootScope', 'NavigationService',
        function ($rootScope, navigationService) {
            $rootScope.go = navigationService.go;
        }
    ]);
