angular.module('kkWallet')
  .directive('securityNotification', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        popupTemplate: '@'
      },
      controller: ['$scope', function($scope) {
        $scope.$root = $scope.$parent.$root;
        $scope.$prevScope = $scope.$parent.$parent;
      }],
      templateUrl: 'app/popup/directives/security-notification.tpl.html'
    };
  });

