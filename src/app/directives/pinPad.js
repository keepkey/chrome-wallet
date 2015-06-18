angular.module('kkWallet')
    .directive('pinPad', function backButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                buttonText: '@'
            },
            controller: ['$scope', 'DeviceBridgeService',
                function ($scope, deviceBridgeService) {
                    $scope.pin = '';
                    $scope.displayPin = '';
                    $scope.appendToPin = function (position) {
                        $scope.pin = '' + $scope.pin + position;
                    };
                    $scope.sendPin = function() {
                        deviceBridgeService.sendPin({pin: $scope.pin});
                        $scope.pin = '';
                    };
                    $scope.$watch('pin', function() {
                        $scope.displayPin = new Array($scope.pin.length + 1).join('*');
                    });
                }
            ],
            templateUrl: 'app/directives/pinPad.tpl.html'

        };
    })
;