angular.module('kkWallet')
    .controller('ButtonRequestController', ['$scope', '$routeParams', 'DeviceBridgeService', 'ProxyInfoService', 'NavigationService', 'DeviceFeatureService',
        function ButtonRequestController($scope, $routeParams, deviceBridgeService, proxyInfoService, navigationService, deviceFeatureService) {
            navigationService.setNextTransition('slideLeft');
            $scope.buttonRequestType = $routeParams.code;
            $scope.proxyInfo = proxyInfoService.info;
            $scope.device = deviceFeatureService.features;
            $scope.$watch('proxyInfo.imageHashCodeTrezor', function(newVal) {
                if (newVal) {
                    $scope.firmwareFingerprint = newVal.match(/.{1,40}/g);
                } else {
                    $scope.firmwareFingerprint = [];
                }
            });
        }
    ]);
