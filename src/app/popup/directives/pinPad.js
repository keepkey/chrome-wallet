angular.module('kkWallet')
  .directive('pinPad', function pinPad() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        buttonText: '@',
        successRoute: '@'
      },
      controller: ['$scope', 'DeviceBridgeService', 'NavigationService',
        function ($scope, deviceBridgeService, navigationService) {
          $scope.pin = '';
          $scope.displayPin = '';
          $scope.appendToPin = function (position) {
            $scope.pin = '' + $scope.pin + position;
          };
          $scope.sendPin = function() {
            navigationService.setNextTransition('slideLeft');
            deviceBridgeService.sendPin({pin: $scope.pin});
            $scope.pin = '';
            if ($scope.successRoute) {
              navigationService.go($scope.successRoute, 'slideRight');
            }
          };
          $scope.$watch('pin', function() {
            $scope.displayPin = new Array($scope.pin.length + 1).join('*');
          });
          $scope.reset = function() {
            $scope.pin = '';
          }
        }
      ],
      templateUrl: 'app/popup/directives/pinPad.tpl.html'

    };
  });