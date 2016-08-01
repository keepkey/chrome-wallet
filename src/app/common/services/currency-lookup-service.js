angular.module('kkCommon')
  .factory('CurrencyLookupService', function CurrencyLookupService() {
    var coinType = {
      Bitcoin: {
        name: 'Bitcoin',
        currencySymbol: 'BTC',
        coinTypeCode: "0'"
      },
      Litecoin: {
        name: 'Litecoin',
        currencySymbol: 'LTC',
        coinTypeCode: "2'"
      }
    };

    return {
      getCurrencySymbol: function getCurrencySymbol(currencyName) {
        return _.get(coinType, [currencyName, 'currencySymbol'].join('.'));
      },
      getCurrencyCode: function getCurrencyCode(currencyName) {
        return _.get(coinType, [currencyName, 'coinTypeCode'].join('.'));
      },
      getCurrencyTypes: function () {
        return _.keys(coinType);
      }
    }
  });