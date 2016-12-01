angular.module('kkCommon')
  .factory('CurrencyLookupService', function CurrencyLookupService() {

    return {
      set: function(metadata) {
        coinType = metadata;
        _.each(coinType, function(meta) {
          meta.addressRegExp = new RegExp(meta.addressFormat);
          meta.displayAmountConstructor = BigNumber.another(meta.amountParameters);
        });
      },
      getCurrencySymbol: function getCurrencySymbol(currencyName) {
        return _.find(coinType, { name: currencyName }).currencySymbol;
      },
      getCurrencyCode: function getCurrencyCode(currencyName) {
        return _.find(coinType, { name: currencyName }).coinTypeCode;
      },
      getCurrencyAddressRegExp: function getCurrencyCode(currencyName) {
        return _.find(coinType, { name: currencyName }).addressRegExp;
      },
      getCurrencyTypes: function () {
        return _.map(coinType, 'name');
      },
      getDust: function getDust(currencyName) {
        return _.find(coinType, { name: currencyName }).dust;
      },
      formatAmount: function (currencyName, amount) {
        if (_.isUndefined(amount)) {
          amount = 0;
        }
        var currencySettings = _.find(coinType, { name: currencyName });
        var result = new currencySettings.displayAmountConstructor(amount)
          .shift(-currencySettings.decimals);
        return result.gte(0) ? result : 0.0;
      },
      unformatAmount: function(currencyName, amount) {
        if (['', '.', undefined].includes(amount)) {
          amount = 0;
        }
        var currencySettings = _.find(coinType, { name: currencyName });
        return new BigNumber(amount)
          .shift(currencySettings.decimals)
          .round();
      }
    }
  });