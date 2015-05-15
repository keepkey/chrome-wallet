angular.module('kkWallet')
    .controller('SuccessController', ['$scope', '$routeParams',
        function SuccessController($scope, $routeParams) {
            $scope.message = decodeURIComponent($routeParams.message);
        }
    ]);
