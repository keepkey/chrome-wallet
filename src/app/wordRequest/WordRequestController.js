angular.module('kkWallet')
    .controller('WordRequestController', ['$scope', 'DeviceBridgeService',
        function ResetController($scope, deviceBridgeService) {
            $scope.word = '';
            $scope.send = function() {
                if (!$scope.form.$valid) {
                    return false;
                }
                deviceBridgeService.acknowledgeWord($scope.word);
                $scope.word = '';

                return false;
            };
        }
    ]);
