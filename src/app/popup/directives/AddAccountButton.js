angular.module('kkWallet')
  .directive('addAccountButton', function () {
    return {
      restrict: 'E',
      replace: true,
      controller: ['$scope', 'NavigationService', 'WalletNodeService',
        function ($scope, navigationService, walletNodeService) {
          $scope.onClick = function () {
            var destination;

            if (!getLastAccount().hasTransactionHistory) {
              destination = '/failure/create_account_failed';
            } else {
              destination = '/accountConfig';
            }

            $scope.go(destination, 'slideLeft');
          }

          function getLastAccount() {
            var lastAccount = _.last(_.sortBy(walletNodeService.wallets,
              function (account) {
                return parseInt(account.accountNumber);
              }
            ));

            return lastAccount;
          }
        }
      ],
      templateUrl: 'app/popup/directives/AddAccountButton.tpl.html'
    };
  });