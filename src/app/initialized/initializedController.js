angular.module('kkWallet')
    .controller('InitializedController', ['$scope', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService',
        function InitializedController($scope, deviceBridgeService, navigationService, walletNodeService) {
            $scope.wallets = walletNodeService.wallets;

            $scope.wipeDevice = function() {
                navigationService.setNextTransition('slideLeft');
                deviceBridgeService.wipeDevice();
            };
        }
    ]);
