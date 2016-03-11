angular.module('kkWallet')
  .directive('walletSelectorDropdown', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        label: '@',
        buttonId: '@',
        accountList: '=',
        selected: '=',
        disabled: '='
      },
      controller: ['$scope', function($scope) {
        $scope.select = function(account) {
          $scope.selected = account;
        }
      }],
      templateUrl: 'app/popup/directives/WalletSelectorDropdown.tpl.html'
    };
  });