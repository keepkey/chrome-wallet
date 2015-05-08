angular.module('kkWallet')
    .controller('ButtonRequestController', ['$scope', '$routeParams', 'DeviceBridgeService',
        function ButtonRequestController($scope, $routeParams, deviceBridgeService) {
            $scope.buttonRequestType = $routeParams.code;
            $scope.onCancel = function() {
                deviceBridgeService.cancel();
            };
        }
    ]);
