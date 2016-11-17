angular.module('kkWallet')
  .controller('ConnectController', ['$scope', 'DeviceBridgeService',
    function ($scope, deviceBridgeService) {
      $scope.noDevice = false;
      deviceBridgeService.getDevices()
        .then(function (status) {
          $scope.noDevice = !status;
        });
    }
  ]);
