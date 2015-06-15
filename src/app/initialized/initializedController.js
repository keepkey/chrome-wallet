angular.module('kkWallet')
    .controller('InitializedController', ['$scope', 'DeviceBridgeService', 'NavigationService',
        function InitializedController($scope, deviceBridgeService, navigationService) {
            $scope.wipeDevice = function() {
                navigationService.setNextTransition('slideLeft');
                deviceBridgeService.wipeDevice();
            };
        }
    ]);
