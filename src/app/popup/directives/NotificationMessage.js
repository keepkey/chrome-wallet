angular.module('kkWallet')
  .directive('notificationMessage', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        canNotify: '=?'
      },
      controller: ['$scope', '$timeout', 'NotificationMessageService',
        function($scope, $timeout, notificationMessageService) {
          $scope.message = '';
          $scope.showMessage = false;

          if(angular.isUndefined($scope.canNotify)) {
            $scope.canNotify = true;
          }
          
          function showNotification(message) {
            $scope.message = message;
            $scope.showMessage = true;

            $timeout(function() {
              $scope.showMessage = false;
            }, 1500);
          }

          $scope.$watch("notificationMessageService.get()", function() {
            var message = notificationMessageService.get();

            if(message !== '' && $scope.canNotify) {
              showNotification(notificationMessageService.get());
              notificationMessageService.clear();
            }
          });
        }
      ],
      templateUrl: 'app/popup/directives/notificationMessage.tpl.html'
    };
  });