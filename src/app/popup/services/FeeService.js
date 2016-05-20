angular.module('kkWallet')
  .factory('FeeService', ['$rootScope', 'DeviceBridgeService',
    function FeeService($rootScope, deviceBridgeService) {
      var fees = {};
      var estimatedFee = {};
      var maxTransactionAmount = {};

      return {
        fees: fees,
        estimatedFee: estimatedFee,
        maxTransactionAmount: maxTransactionAmount,
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
