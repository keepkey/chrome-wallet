angular.module('kkWallet')
    .controller('FailureController', ['$scope', '$timeout', 'FailureMessageService', 'DeviceBridgeService',
        function FailureController($scope, $timeout, failureMessageService, deviceBridgeService) {
            $scope.failures = failureMessageService.get();

            $scope.ok = function() {
                deviceBridgeService.initialize();
                failureMessageService.clear();
            };
        }
    ]);
