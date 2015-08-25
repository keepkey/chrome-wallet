angular.module('kkWallet')
  .factory('FormatBitcoinService',
    function() {
      return {
        toBits: function(satoshis) {
          return satoshis / 100;
        },
        toMillis: function(satoshis) {
          return satoshis / 100000;
        },
        toBitcoin: function(satoshis) {
          return satoshis / 100000000;
        },
        BITS: 'bits',
        MILLIBITS: 'mBTC',
        BITCOINS: 'BTC'
      };
    }
  );