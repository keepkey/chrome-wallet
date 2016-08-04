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
        currencyName: '@'
      },
      link: function ($scope) {
        $scope.field = _.get($scope.form, $scope.fieldName);
      },
      controller: ['$scope', 'WalletNodeService', 'DeviceFeatureService',
        function ($scope, walletNodeService, featureService) {
          $scope.labelVariation = 'Send ' + $scope.currencyName + ' to:';

          $scope.currentAccount =
            walletNodeService.getWalletById($scope.currentAccountNumber);
          if (walletNodeService.wallets.length > 1 &&
            _.get(featureService.features,
              "deviceCapabilities.supportsSecureAccountTransfer")) {
            $scope.placeholder = "Enter address or select an account...";
            $scope.accounts = _(walletNodeService.wallets)
              .reject({
                id: $scope.currentAccountNumber
              })
              .sortBy('name')
              .value();
          } else {
            $scope.placeholder = "Enter an address...";
            $scope.accounts = [];
          }
          $scope.$watch('selected', function () {
            var label;
            var destinationAccount = _.get($scope.selected, 'accountNumber');
            if (destinationAccount) {
              if ($scope.currentAccount.coinType ===
                $scope.selected.coinType) {
                label = ['Transfer', $scope.currencyName, 'to account'];
              } else {
                label = [
                  'Convert', $scope.currencyName,
                  'to', $scope.selected.coinType,
                  'and send to'
                ];
              }
            } else if (_.isString($scope.selected) &&
              $scope.selected.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) { //TODO use a regexp appropriate for the currency
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