angular.module('kkWallet')
    .controller('PinController', ['$scope', '$routeParams', 'PinModel', 'DeviceBridgeService', 'NavigationService',
        function PinController($scope, $routeParams, pinModel, deviceBridgeService, navigationService) {
            $scope.displayPin = '';
            $scope.pinData = pinModel;
            $scope.requestType = $routeParams.type;
            $scope.previousRoute = navigationService.getPreviousRoute();

            navigationService.setNextTransition('slideLeft');

            $scope.appendToPin = function(position) {
                $scope.pinData.pin = '' + $scope.pinData.pin + position;
            };

            $scope.$watch('pinData.pin', function() {
                $scope.displayPin = new Array($scope.pinData.pin.length + 1).join('*');
            });
            $scope.sendPinToDevice = function() {
                deviceBridgeService.sendPin($scope.pinData);
                $scope.pinData.clear();
            };
        }
    ])
    .factory('PinModel', function ResetModel() {
        return {
            pin: '',
            clear: function() {
                this.pin = '';
            }
        };
    });
