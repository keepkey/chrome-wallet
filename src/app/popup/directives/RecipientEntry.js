angular.module('kkWallet')
  .directive('recipientEntry', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        selected: '=recipient',
        fieldName: '@',
        form: '=',
        disabled: '=',
        currentAccountNumber: '=currentAccount',
        currencyName: '@',
        addressAllowed: '@',
        transferAllowed: '@',
        exchangeAllowed: '@'
      },
      link: function ($scope) {
        $scope.field = _.get($scope.form, $scope.fieldName);
      },
      controller: [
        '$scope', 'WalletNodeService', 'DeviceFeatureService',
        'CurrencyLookupService',
        function ($scope, walletNodeService, featureService,
                  currencyLookupService) {

          $scope.acceptAddress = ($scope.addressAllowed === 'true');
          $scope.acceptTransfer = ($scope.transferAllowed === 'true');
          $scope.acceptExchange = ($scope.exchangeAllowed === 'true');

          $scope.useDropdown = !$scope.acceptAddress;

          $scope.labelVariation = 'Send ' + $scope.currencyName + ' to:';

          $scope.currentAccount =
            walletNodeService.getWalletById($scope.currentAccountNumber);

          var addressValidationRegExp = currencyLookupService
            .getCurrencyAddressRegExp($scope.currentAccount.coinType);

          if (walletNodeService.wallets.length > 1) {
            $scope.placeholder = "Enter address or select an account...";
            var walletList = _(walletNodeService.wallets)
              .reject({
                id: $scope.currentAccountNumber
              });

            if (!_.get(featureService.features,
                "deviceCapabilities.supportsSecureAccountTransfer") || !$scope.acceptTransfer) {
              walletList = _(walletNodeService.wallets)
                .reject({
                  coinType: $scope.currentAccount.coinType
                })
            }

            if (!$scope.acceptExchange) {
              walletList = _(walletNodeService.wallets)
                .filter({
                  coinType: $scope.currentAccount.coinType
                })
            }
            $scope.accounts = walletList.sortBy('name').value();
          } else {
            $scope.placeholder = "Enter an address...";
            $scope.accounts = [];
          }
          var patterns = [];
          if ($scope.acceptAddress) {
            patterns.push(addressValidationRegExp.source);
          }
          Array.prototype.push.apply(patterns, _.map($scope.accounts, function (account) {
            return '^' + account.name + '$';
          }));

          $scope.pattern = patterns.join('|');

          if ($scope.useDropdown && $scope.accounts.length) {
            $scope.selected = $scope.accounts[0];
          }

          $scope.setDestinationAccount = function(account) {
            $scope.selected = account;
          };

          $scope.$watch('selected', function () {
            var label;
            var destinationAccount = _.get($scope.selected, 'accountNumber');
            if (destinationAccount) {
              if ($scope.currentAccount.coinType === $scope.selected.coinType) {
                label = ['Transfer', $scope.currencyName, 'to account'];
              } else {
                label = [
                  'Convert', $scope.currencyName,
                  'to', $scope.selected.coinType,
                  'and send to'
                ];
              }
            } else if (_.isString($scope.selected) &&
              $scope.selected.match(addressValidationRegExp)) {
              label = ['Send', $scope.currencyName, 'to address'];
            } else {
              label = ['Send', $scope.currencyName, 'to'];
            }
            $scope.labelVariation = label.join(' ') + ':';
          });

        }
      ],
      templateUrl: 'app/popup/directives/RecipientEntry.tpl.html'

    };
  });