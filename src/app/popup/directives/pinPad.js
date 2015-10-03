angular.module('kkWallet')
    .directive('pinPad', function backButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                buttonText: '@',
                returnToPreviousRoute: '@returnToPreviousRoute'
            },
            controller: ['$scope', 'DeviceBridgeService', 'NavigationService',
                function ($scope, deviceBridgeService, navigationService) {
                    $scope.pin = '';
                    $scope.displayPin = '';
                    $scope.appendToPin = function (position) {
                        $scope.pin = '' + $scope.pin + position;
                    };
                    $scope.sendPin = function() {
                        navigationService.setNextTransition('slideLeft');
                        deviceBridgeService.sendPin({pin: $scope.pin});
                        $scope.pin = '';
                        if ($scope.returnToPreviousRoute === 'true') {
                            navigationService.goToPrevious('slideRight');
                        }
                    };
                    $scope.$watch('pin', function() {
                        $scope.displayPin = new Array($scope.pin.length + 1).join('*');
                    });
                }
            ],
            templateUrl: 'app/popup/directives/pinPad.tpl.html'

        };
    })
;