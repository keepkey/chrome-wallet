angular.module('kkWallet')
  .directive('vendorName', function vendorName() {
    return {
      restrict: 'E',
      replace: true,
      controller: ['$scope', 'DeviceFeatureService',
        function ($scope, deviceFeatureService) {
          $scope.vendorName =
            deviceFeatureService.get('deviceCapabilities.vendorName');
        }
      ],
      template: '<span class="vendor-name"> {{vendorName}} </span>'
    };
  });