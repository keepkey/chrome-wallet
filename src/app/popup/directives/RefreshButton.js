angular.module('kkWallet')
  .directive('refreshButton', function refreshButton() {
    return {
      restrict: 'E',
      replace: true,
      controller: ['$scope', 'DeviceBridgeService', 'WalletNodeService',
        function ($scope, deviceBridgeService, walletNodeService) {
          $scope.refresh = function () {
            walletNodeService.setUnfresh();
            deviceBridgeService.reloadBalances();
          };
        }
      ],
      template: '<a class="refresh-button">' +
      '<div class="icon icon-refresh" ng-click="refresh()"></div>' +
      '</a>'
    };
  });