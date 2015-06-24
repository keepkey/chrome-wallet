angular.module('kkWallet')
    .controller('InitializedController', ['$scope', 'DeviceBridgeService', 'NavigationService', 'WalletService',
        function InitializedController($scope, deviceBridgeService, navigationService, walletService) {

            $scope.wallets = walletService.wallets;

            $scope.wipeDevice = function() {
                navigationService.setNextTransition('slideLeft');
                deviceBridgeService.wipeDevice();
            };
        }
    ]);
