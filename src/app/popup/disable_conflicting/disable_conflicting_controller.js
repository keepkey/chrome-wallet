angular.module('kkWallet')
  .controller('DisableConflictingController', [
    '$scope', '$routeParams', 'NavigationService', 'DeviceBridgeService',
    '$timeout', 'ChromeManagementService',
    function DisableConflictingController($scope, $routeParams,
                                          navigationService, 
                                          deviceBridgeService, $timeout,
                                          chromeManagementService) {

      chromeManagementService.getExtensionData($routeParams.id, addExtensionDataToScope);

      function addExtensionDataToScope(extension) {
        $scope.appName = extension.name;
        $scope.extensionId = extension.id;
      }

      $scope.disableExtension = function disableExtension() {
        chromeManagementService.disableExtension($scope.extensionId);
        deviceBridgeService.cancel();
        $timeout(function() {
          deviceBridgeService.initialize();
        });
      }
    }
  ]);
