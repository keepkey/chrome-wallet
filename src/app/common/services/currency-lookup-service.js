angular.module('kkCommon')
  .factory('CurrencyLookupService', function CurrencyLookupService() {
    var coinType = {
      Bitcoin: {
        name: 'Bitcoin',
        currencySymbol: 'BTC'
      },
      Litecoin: {
        name: 'Litecoin',
        currencySymbol: 'LTC'
      }
    };

    function getCurrencySymbol(currencyName) {
      return _.get(coinType, currencyName + '.currencySymbol');
    }

    return {
      getCurrencySymbol: getCurrencySymbol
    }
  });