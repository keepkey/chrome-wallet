angular.module('kkWallet')
  .directive('walletBalance', function walletBalance() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        balance: '=',
        pending: '=',
        loading: '=',
        currency: '='
      },
      templateUrl: 'app/popup/directives/walletBalance.tpl.html'
    };
  });