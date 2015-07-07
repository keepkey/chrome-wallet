angular.module('kkWallet')
    .controller('InitializedController', ['$scope', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
        function InitializedController($scope, deviceBridgeService, navigationService, walletNodeService, transactionService) {
            $scope.wallets = walletNodeService.wallets;
            $scope.balances = transactionService.walletBalances;

            $scope.wipeDevice = function() {
                navigationService.setNextTransition('slideLeft');
                deviceBridgeService.wipeDevice();
            };
        }
    ]);
