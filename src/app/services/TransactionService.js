/* global _ */
angular.module('kkWallet')
  .factory('TransactionService', ['$rootScope', 'DeviceBridgeService',
    function ($rootScope, deviceBridgeService) {
      var transactionInProgress = {};

      return {
        transactionInProgress: transactionInProgress
      };
    }
  ]);