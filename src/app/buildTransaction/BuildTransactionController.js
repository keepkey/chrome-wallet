angular.module('kkWallet')
    .controller('BuildTransactionController', ['$scope', '$routeParams', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
        function BuildTransactionController($scope, $routeParams, deviceBridgeService, navigationService, walletNodeService, transactionService) {
            $scope.transactionInProgress = false;
            $scope.userInput = {
                sourceIndex: $routeParams.wallet,
                sourceName: walletNodeService.wallets[$routeParams.wallet].name,
                address: walletNodeService.firstUnusedAddress(walletNodeService.wallets[1].addresses[0]), //TODO This is an odd default.
                amount: 0.001
            };
            $scope.buildTransaction = function() {
                angular.copy($scope.userInput, transactionService.transactionInProgress);
                deviceBridgeService.requestTransactionSignature(transactionService.transactionInProgress);
                $scope.go('/success/bouncies');

            }
        }
    ]);
