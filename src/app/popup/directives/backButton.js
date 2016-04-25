angular.module('kkWallet')
  .directive('backButton', function backButton() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        destination: '=?',
        animation: '=?',
        action: '&?'
      },
      controller: ['$scope', 'NavigationService',
        function ($scope, navigationService) {
          $scope.hasPreviousRoute = navigationService.hasPreviousRoute();
          if (!$scope.animation) {
            $scope.animation = 'slideRight';
          }
          if ($scope.destination) {
            $scope.actionFunction = function () {
              navigationService.go($scope.destination, $scope.animation);
            };
          } else if ($scope.action) {
            $scope.actionFunction = $scope.action;
          } else {
            $scope.actionFunction = function () {
              navigationService.goToPrevious($scope.animation);
            }
          }
        }
      ],
      template: '<a class="back-button" ng-show="hasPreviousRoute" ng-click="actionFunction()">' +
      '<div class="icon icon-back"></div>' +
      '</a>'
    };
  });