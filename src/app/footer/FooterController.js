angular.module('kkWallet')
    .controller('FooterController', ['$scope', 'VERSION', 'DeviceFeatureService',
        function InitializationController($scope, VERSION, deviceFeatureService) {
            $scope.version = VERSION;
            $scope.device = deviceFeatureService.features;
        }
    ]);
