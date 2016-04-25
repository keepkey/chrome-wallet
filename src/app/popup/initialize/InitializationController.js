angular.module('kkWallet')
    .controller('InitializationController', ['$scope', 'InitializationDataService', 'WalletNodeService',
        function InitializationController($scope, initializationDataService, walletNodeService) {
            $scope.initializationData = initializationDataService;
            $scope.displayPin = '';

            walletNodeService.clear();

            $scope.appendToPin = function(digit) {
                $scope.initializationData.pin = '' + $scope.initializationData.pin + digit;
            };

            $scope.$watch('initializationData.pin', function() {
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
