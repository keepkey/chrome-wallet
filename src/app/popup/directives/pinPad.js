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
            deviceBridgeService.sendPin({pin: $scope.pin});
            $scope.pin = '';
            if ($scope.successRoute) {
              navigationService.go($scope.successRoute);
            }
          };
          $scope.$watch('pin', function() {
            $scope.displayPin = new Array($scope.pin.length + 1).join('*');
          });
          $scope.backspace = function() {
            if ($scope.pin.length > 0) {
              $scope.pin = $scope.pin.substr(0, $scope.pin.length - 1);
            }
          }
        }
      ],
      templateUrl: 'app/popup/directives/pinPad.tpl.html'

    };
  });