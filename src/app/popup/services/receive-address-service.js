angular.module('kkWallet')
  .factory('ReceiveAddressService', [
    function() {
      var address = {};
      return {
        set: function (value) {
          angular.copy(value, address);
        },
        clear: function() {
          angular.copy({}, address);
        },
        value: address
      }
    }
  ]);