angular.module('kkWallet')
    .controller('PinController', ['$scope', '$routeParams', 'PinModel', 'DeviceBridgeService',
        function PinController($scope, $routeParams, PinModel, DeviceBridgeService) {
            $scope.displayPin = '';
            $scope.pinData = PinModel;
            $scope.requestType = $routeParams.type;

            $scope.appendToPin = function(position) {
                $scope.pinData.pin = '' + $scope.pinData.pin + position;
            };

            $scope.$watch('pinData.pin', function() {
                $scope.displayPin = new Array($scope.pinData.pin.length + 1).join('*');
            });
            $scope.sendPinToDevice = function() {
                DeviceBridgeService.sendPin($scope.pinData);
                $scope.pinData.clear();
                //$scope.go('/waitForDevice');
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
