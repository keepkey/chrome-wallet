/* global _ */
angular.module('kkWallet')
  .factory('TransactionService', ['$rootScope', 'DeviceBridgeService',
    function ($rootScope, deviceBridgeService) {
      var transactions = [];
      var walletBalances = {};
      var addressBalances = {};
      var transactionInProgress = {};

      function getTransactionStats(groupingFn) {
        var newBalances = {};

        var groupedTransactions = _.groupBy(transactions, groupingFn);

        _.each(groupedTransactions, function (transactions, key) {
          var total = _.reduce(transactions, function (total, transaction) {
            return total + transaction.amount;
          }, 0);

          var leastConfirmed = _.reduce(transactions, function (least, transaction) {
            return Math.min(least, transaction.confirmations);
          }, 999999);

          newBalances[key] = {
            balance: total,
            confirmations: leastConfirmed,
            transactions: transactions,
            count: transactions.length
          };
        });
        return newBalances
      }

      function groupByWallet(it) {
        return it.nodePath.split('/').slice(0, 4).join('/');
      }

      function groupByAddress(it) {
        return it.address;
      }

      function updateTransactions(newTransactions) {
        angular.copy(newTransactions, transactions);

        angular.copy(getTransactionStats(groupByWallet), walletBalances);
        angular.copy(getTransactionStats(groupByAddress), addressBalances);

        $rootScope.$digest();
      }

      function selectInputs(hdNode, amount) {
        var transactionNodes = _.pluck(transactions, 'nodePath');
      }

      deviceBridgeService.getTransactions();

      return {
        transactions: transactions,
        updateTransactions: updateTransactions,
        walletBalances: walletBalances,
        addressBalances: addressBalances,
        transactionInProgress: transactionInProgress
      };
    }
  ]);