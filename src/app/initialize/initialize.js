angular.module('kkWallet')
    .controller('InitializationController', ['$scope', 'InitializationDataService', 'NavigationService',
        function InitializationController($scope, initializationDataService, nav) {
            $scope.initializationData = initializationDataService;
        }
    ])
    .factory('InitializationDataService', function () {
        return {
            label: ''
        };
    });
