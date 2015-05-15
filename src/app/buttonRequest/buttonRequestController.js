angular.module('kkWallet')
    .controller('ButtonRequestController', ['$scope', '$routeParams', 'DeviceBridgeService', 'ProxyInfoService',
        function ButtonRequestController($scope, $routeParams, deviceBridgeService, proxyInfoService) {
            $scope.buttonRequestType = $routeParams.code;
            $scope.firmwareFingerprint = proxyInfoService.info.imageHashCode.match(/.{1,40}/g);
            $scope.onCancel = function() {
                deviceBridgeService.cancel();
            };
        }
    ]);
