angular.module('kkWallet')
  .directive('refreshButton', function refreshButton() {
    return {
      restrict: 'E',
      replace: true,
      controller: ['$scope', 'DeviceBridgeService',
        function ($scope, deviceBridgeService) {
          $scope.refresh = function () {
            deviceBridgeService.reloadBalances();
          };
        }
      ],
      template: '<a class="refresh-button">' +
      '<div class="icon icon-refresh" ng-click="refresh()"></div>' +
      '</a>'
    };
  });