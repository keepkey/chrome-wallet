angular.module('kkWallet')
  .controller('InitializationController', ['$scope', 
    'InitializationDataService', 'WalletNodeService', 'DeviceFeatureService',
    function InitializationController($scope, initializationDataService,
                                      walletNodeService, featureService) {
      $scope.features = featureService.features;
      $scope.initializationData = initializationDataService;
      $scope.displayPin = '';

      walletNodeService.clear();

      $scope.appendToPin = function (digit) {
        $scope.initializationData.pin = '' + $scope.initializationData.pin + digit;
      };

      $scope.$watch('initializationData.pin', function () {
        $scope.displayPin = new Array($scope.initializationData.pin.length + 1).join('*');
      });

    }
  ])
  .factory('InitializationDataService', function () {
    return {
      label: '',
      pin: ''
    };
  });
