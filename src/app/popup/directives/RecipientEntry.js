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
        label: '@',
        currentAccount: '='
      },
      link: function ($scope) {
        $scope.field = _.get($scope.form, $scope.fieldName);
      },
      controller: ['$scope', 'WalletNodeService', 'DeviceFeatureService',
        function ($scope, walletNodeService, featureService) {
          $scope.labelVariation = $scope.label;
          if (walletNodeService.wallets.length > 1 &&
            _.get(featureService.features,
              "deviceCapabilities.supportsSecureAccountTransfer")) {
            $scope.placeholder = "Enter address or select an account...";
            $scope.accounts = _.sortBy(_.reject(walletNodeService.wallets, {
              id: $scope.currentAccount
            }), 'name');
          } else {
            $scope.placeholder = "Enter an address...";
            $scope.accounts = [];
          }
          $scope.$watch('selected', function () {
            var accountNumber = _.get($scope.selected, 'accountNumber');
            if (accountNumber) {
              $scope.labelVariation = 'Send bitcoin to account:';
            } else if (_.isString($scope.selected) &&
              $scope.selected.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
              $scope.labelVariation = 'Send bitcoin to address:';
            } else {
              $scope.labelVariation = $scope.label;
            }
          })

        }
      ],
      templateUrl: 'app/popup/directives/RecipientEntry.tpl.html'

    };
  });