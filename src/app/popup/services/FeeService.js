angular.module('kkWallet')
  .factory('FeeService', ['$rootScope', 'DeviceBridgeService',
    function FeeService($rootScope, deviceBridgeService) {
      var fees = {};
      var updateInProgress = false;
      var estimatedFee = {};
      var maxTransactionAmount = {};

      return {
        fees: fees,
        estimatedFee: estimatedFee,
        maxTransactionAmount: maxTransactionAmount,
        update: function () {
          if (!updateInProgress) {
            updateInProgress = true;
            deviceBridgeService.getFees()
              .then(function () {
                updateInProgress = false;
              });
          }
        },
        set: function (value) {
          angular.copy(value, fees);
        },
        setEstimate: function(value) {
          angular.copy(value, estimatedFee);
          setTimeout(function() {
            $rootScope.$digest();
          }, 0);
        },
        setMaxTransactionAmount: function(value) {
          angular.copy(value, maxTransactionAmount);
          setTimeout(function() {
            $rootScope.$digest();
          }, 0);
        },
        feeOptions: ['slow', 'medium', 'fast'],
        compute: deviceBridgeService.estimateFeeForTransaction,
        getMaximumTransactionAmount: deviceBridgeService.getMaximumTransactionAmount
      };
    }
  ]);
