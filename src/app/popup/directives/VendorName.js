angular.module('kkWallet')
  .directive('vendorName', function vendorName() {
    return {
      scope: {
        before: '@',
        after: '@'
      },
      restrict: 'E',
      replace: true,
      controller: ['$scope', 'DeviceFeatureService',
        function ($scope, deviceFeatureService) {
          $scope.vendorName =
            deviceFeatureService.get('deviceCapabilities.vendorName');
        }
      ],
      template: '<span class="vendor-name"> {{before}}{{vendorName}}{{after}} </span>'
    };
  });