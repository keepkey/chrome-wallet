kkWallet
    .controller('InitializationController',
    ['$scope', 'InitializationDataService', function InitializationController($scope, initializationDataService) {
        $scope.initializationData = initializationDataService;
    }])
    .factory('InitializationDataService', function() {
        return {
            label: ''
        };
    });
