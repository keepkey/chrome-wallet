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
                .when('/buttonRequest/button_request_confirm_output', {
                    templateUrl: 'app/buttonRequest/confirmOutput.tpl.html',
                    goable: false
                })
                .when('/buttonRequest/button_request_sign_tx', {
                    templateUrl: 'app/buttonRequest/signTx.tpl.html',
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
                .when('/failure/pin_change_failed', {
                    templateUrl: 'app/failure/pinConfirmationFailed.tpl.html',
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
                .when('/success/bouncies', {
                    templateUrl: 'app/success/bouncies.tpl.html',
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
                .when('/pin/pin_matrix_request_type_new_first', {
                    templateUrl: 'app/pin/newPin.tpl.html',
                    goable: false
                })
                .when('/pin/pin_matrix_request_type_new_second', {
                    templateUrl: 'app/pin/confirmPin.tpl.html',
                    goable: false
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
                .when('/buildTransaction/:wallet', {
                    templateUrl: 'app/buildTransaction/buildTransaction.tpl.html',
                    goable: true
                })
                .otherwise({
                    redirectTo: '/'
                });
        }])
    .factory('NavigationService', ['$location', '$rootScope', '$route', '$timeout',
        function ($location, $rootScope, $route, $timeout) {
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

            function go(path, pageAnimationClass) {

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
                    $rootScope.pageAnimationClass = 'cross-fade';
                }
                console.log('navigating from %s to %s with "%s" transition', previousRoute, path, $rootScope.pageAnimationClass);
                nextTransition = undefined;

                $timeout(function() {
                    $rootScope.$digest();
                    $location.path(path);
                });
            }

            return {
                go: go,
                goToPrevious: function() {
                    go(previousRoute);
                },
                setNextTransition: function (pageAnimationClass) {
                    nextTransition = pageAnimationClass;
                },
                setNextDestination: function (destination) {
                    nextDestination = destination;
                },
                getPreviousRoute: function () {
                    return previousRoute;
                },
                getCurrentRoute: function() {
                    return $location.path();
                }
            };
        }
    ])
    .run(['$rootScope', 'NavigationService',
        function ($rootScope, navigationService) {
            $rootScope.go = navigationService.go;
        }
    ]);
