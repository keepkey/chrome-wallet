angular.module('kkWallet')
    .controller('InitializationController', ['$scope', 'InitializationDataService', 'DeviceFeatureService', 'DeviceBridgeService',
        function InitializationController($scope, initializationDataService, deviceFeatureService, deviceBridgeService) {
            $scope.initializationData = initializationDataService;
            $scope.displayPin = '';

            if (deviceFeatureService.features.initialized) {
                deviceBridgeService.wipeDevice();
            }

            $scope.appendToPin = function(digit) {
                $scope.initializationData.pin = '' + $scope.initializationData.pin + digit;
            };

            $scope.$watch('initializationData.pin', function() {
                $scope.displayPin = new Array($scope.initializationData.pin.length + 1).join('*');
            });

        }
    ])
    .factory('InitializationDataService', function () {
        return {
            label: '',
            pin: ''
        };
    });
