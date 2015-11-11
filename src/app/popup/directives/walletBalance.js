angular.module('kkWallet')
  .directive('walletBalance', function walletBalance() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        balance: '=',
        pending: '=',
        loading: '='
      },
      templateUrl: 'app/popup/directives/walletBalance.tpl.html'
    };
  });