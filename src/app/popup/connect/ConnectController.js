angular.module('kkWallet')
  .controller('ConnectController', ['$scope', 'DeviceBridgeService',
    function ($scope, deviceBridgeService) {
      $scope.noDevice = false;
      deviceBridgeService.getDevices()
        .then(function (response) {
          if (response && response.length) {
            deviceBridgeService.initialize();
          } else {
            $scope.noDevice = true;
          }
        });
    }
  ]);
