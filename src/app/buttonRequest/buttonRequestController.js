angular.module('kkWallet')
    .controller('ButtonRequestController', ['$scope', '$routeParams', 'DeviceBridgeService', 'ProxyInfoService',
        function ButtonRequestController($scope, $routeParams, deviceBridgeService, proxyInfoService) {
            $scope.buttonRequestType = $routeParams.code;
            $scope.proxyInfo = proxyInfoService.info;
            $scope.$watch('proxyInfo.imageHashCodeTrezor', function(newVal) {
                if (newVal) {
                    $scope.firmwareFingerprint = newVal.match(/.{1,40}/g);
                } else {
                    $scope.firmwareFingerprint = [];
                }
            });
            $scope.onCancel = function() {
                deviceBridgeService.cancel();
            };
        }
    ]);
