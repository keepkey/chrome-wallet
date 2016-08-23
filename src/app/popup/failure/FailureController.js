angular.module('kkWallet')
  .controller('FailureController', ['$scope', '$timeout', 'FailureMessageService', 'DeviceBridgeService', 'NavigationService',
    function FailureController($scope, $timeout, failureMessageService, deviceBridgeService, navigationService) {
      $scope.failures = _.map(failureMessageService.get(), function(failure) {
          if (failure.message.length) {
            return failure.message.pop();
          } else if (failure.message) {
            return failure.message;
          } else {
            return 'Unspecified error occured';
          }
        });

      if(navigationService.getPreviousRoute() !== '/walletlist'){
        navigationService.setNextTransition('slideRight');
      }

      $scope.ok = function () {
        deviceBridgeService.initialize();
        $timeout(function () {
          failureMessageService.clear();
        }, 2000);
      };
    }
  ]);
