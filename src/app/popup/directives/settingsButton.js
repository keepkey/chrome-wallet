angular.module('kkWallet')
  .directive('settingsButton', function settingsButton() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        route: '=?'
      },
      controller: ['$scope', 'NavigationService', 'DeviceBridgeService',
        function ($scope, navigationService, deviceBridgeService) {
          if (!$scope.route) {
            $scope.route = '/device';
          }
          
          $scope.onClick = function () {
            navigationService.dumpHistory();
            deviceBridgeService.cancel();
            navigationService.go($scope.route, 'slideLeft');
          }
        }
      ],
      template: '<a class="settings-button" ng-click="onClick()">' +
      '<div class="icon icon-settings"></div>' +
      '</a>'
    };
  });