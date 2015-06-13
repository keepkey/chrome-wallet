angular.module('kkWallet')
    .controller('SuccessController', ['$scope', '$routeParams', 'NavigationService',
        function SuccessController($scope, $routeParams, navigationService) {
            $scope.message = decodeURIComponent($routeParams.message);
            navigationService.setNextTransition();
        }
    ]);
