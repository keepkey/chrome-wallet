/* global _ */
angular.module('kkWallet')
    .factory('TransactionService', ['$rootScope', 'DeviceBridgeService',
        function($rootScope, deviceBridgeService) {
            var transactions = [];
            var walletBalances = {};

            function updateTransactions(newTransactions) {
                angular.copy(newTransactions, transactions);
                var newBalances = {};

                var transactionsByWallet = _.groupBy(transactions, function(it) {
                    return it.nodePath.split('/').slice(0, 4).join('/');
                });

                _.each(transactionsByWallet, function(transactions, key) {
                    var total = _.reduce(transactions, function(total, transaction) {
                        return total + transaction.amount;
                    }, 0);

                    var leastConfirmed = _.reduce(transactions, function(least, transaction){
                        return Math.min(least, transaction.confirmations);
                    }, 999999);

                    newBalances[key] = {
                        balance: total,
                        confirmations: leastConfirmed
                    };
                });

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