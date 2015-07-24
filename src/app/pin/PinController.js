angular.module('kkWallet')
    .controller('PinController', ['$scope', '$routeParams', 'NavigationService',
        function PinController($scope, $routeParams, navigationService) {
            $scope.previousRoute = navigationService.getPreviousRoute();
        }
    ]);
