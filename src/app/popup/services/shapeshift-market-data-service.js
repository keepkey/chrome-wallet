/* global _ */
angular.module('kkWallet')
  .factory('ShapeshiftMarketDataService', [
    '$http', 'CurrencyLookupService',
    function ($http, currencyLookupService) {
      var data = {};
      var depositAmountComputed = false;
      var withdrawalAmountComputed = false;

      function setDepositAmount(amount) {
        if (amount !== undefined) {
          if (!data.depositAmount || !data.depositAmount.eq(amount)) {
            depositAmountComputed = false;
            data.depositAmount = Big(amount);
            if (data.rate) {
              withdrawalAmountComputed = true;
              data.withdrawalAmount = data.depositAmount
                .times(data.rate)
                .minus(data.minerFee)
                .round(8);
            }
          }
        }
      }

      function setWithdrawalAmount(amount) {
        if (amount !== undefined) {
          if (!data.withdrawalAmount || !data.withdrawalAmount.eq(amount)) {
            withdrawalAmountComputed = false;
            data.withdrawalAmount = Big(amount);
            if (data.rate) {
              depositAmountComputed = true;
              data.depositAmount = data.withdrawalAmount
                .plus(data.minerFee)
                .div(data.rate)
                .round(8);
            }
          }
        }
      }

      function loadRate(depositCurrency, withdrawalCurrency) {
        if (depositCurrency && withdrawalCurrency) {
          var pair = currencyLookupService.getCurrencySymbol(depositCurrency) +
            '_' + currencyLookupService.getCurrencySymbol(withdrawalCurrency);
          return $http({
            method: 'GET',
            url: 'https://cors.shapeshift.io/marketinfo/' + pair
          })
            .then(function (resp) {
              if (resp.error) {
                clear();
              } else {
                set(resp.data);
              }
            });
        }
      }

      function clear() {
        _.each(data, function(prop) {
          angular.copy({}, data);
        });
        depositAmountComputed = false;
        withdrawalAmountComputed = false;
      }

      function set(value) {
        data.rate = Big(value.rate);
        data.limit = Big(value.limit);
        data.maxLimit = Big(value.maxLimit);
        data.minimum = Big(value.minimum);
        data.minerFee = Big(value.minerFee);
        if (!depositAmountComputed) {
          setDepositAmount(data.depositAmount);
        }
        if (!withdrawalAmountComputed) {
          setWithdrawalAmount(data.withdrawalAmount);
        }
      }

      return {
        loadRate: loadRate,
        clear: clear,
        setDeposit: setDepositAmount,
        setWithdrawal: setWithdrawalAmount,
        data: data
      }
    }
  ]);