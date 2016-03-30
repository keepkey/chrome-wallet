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
      controller: ['$scope', 'WalletNodeService',
        function ($scope, walletNodeService) {
          $scope.accountLabel = '';
          if (walletNodeService.wallets.length > 1) {
            $scope.placeholder = "Enter address or select an account...";
          } else {
            $scope.placeholder = "Enter an address...";
          }
          $scope.accounts = _.sortBy(_.reject(walletNodeService.wallets, {
            id: $scope.currentAccount
          }), 'name');
          $scope.$watch('selected', function () {
            var accountNumber = _.get($scope.selected, 'accountNumber');
            if (accountNumber) {
              $scope.accountLabel = 'Transfer to account #' + accountNumber;
            } else if (_.isString($scope.selected) &&
              $scope.selected.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
              $scope.accountLabel = 'Send to address';
            } else {
              $scope.accountLabel = '';

            }
          })

        }
      ],
      templateUrl: 'app/popup/directives/RecipientEntry.tpl.html'

    };
  });