angular.module('kkWallet')
    .controller('FooterController', ['$scope', 'VERSION', 'DeviceFeatureService',
        function FooterController($scope, VERSION, deviceFeatureService) {
            $scope.version = VERSION;
            $scope.device = deviceFeatureService.features;
        }
    ]);
