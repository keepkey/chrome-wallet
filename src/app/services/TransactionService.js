/* global _ */
angular.module('kkWallet')
    .factory('TransactionService', ['$rootScope', 'DeviceBridgeService',
        function($rootScope, deviceBridgeService) {
            var transactions = [];
            var walletBalances = {};

            function getWalletNode(transaction) {
                return transaction.nodePath.split('/').slice(0, 4).join('/');

            }

            function updateTransactions(newTransactions) {
                angular.copy(newTransactions, transactions);
                var newBalances = {};
                _.reduce(transactions, function(result, it) {
                    result[getWalletNode(it)] = (result[getWalletNode(it)] || 0) + (it.amount / 100000000);
                    return result;
                }, newBalances);
                angular.copy(newBalances, walletBalances);
                $rootScope.$digest();
            }

            deviceBridgeService.getTransactions();

            return {
                transactions: transactions,
                updateTransactions: updateTransactions,
                walletBalances: walletBalances
            };
        }
]);