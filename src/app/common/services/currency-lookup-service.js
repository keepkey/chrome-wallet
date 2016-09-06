angular.module('kkCommon')
  .factory('CurrencyLookupService', function CurrencyLookupService() {
    var coinType = {
      Bitcoin: {
        name: 'Bitcoin',
        currencySymbol: 'BTC',
        coinTypeCode: "0'",
        addressRegExp: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
        dust: 546
      },
      Litecoin: {
        name: 'Litecoin',
        currencySymbol: 'LTC',
        coinTypeCode: "2'",
        addressRegExp: /^L[a-km-zA-HJ-NP-Z1-9]{26,33}$/,
        dust: 100000
      },
      Dogecoin: {
        name: 'Dogecoin',
        currencySymbol: 'DOGE',
        coinTypeCode: "3'",
        addressRegExp: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/,
        dust: 100000000
      }
    };

    return {
      getCurrencySymbol: function getCurrencySymbol(currencyName) {
        return _.get(coinType, [currencyName, 'currencySymbol'].join('.'));
      },
      getCurrencyCode: function getCurrencyCode(currencyName) {
        return _.get(coinType, [currencyName, 'coinTypeCode'].join('.'));
      },
      getCurrencyAddressRegExp: function getCurrencyCode(currencyName) {
        return _.get(coinType, [currencyName, 'addressRegExp'].join('.'));
      },
      getCurrencyTypes: function () {
        return _.keys(coinType);
      },
      getDust: function getDust(currencyName) {
        return _.get(coinType, [currencyName, 'dust'].join('.'));
      }
    }
  });