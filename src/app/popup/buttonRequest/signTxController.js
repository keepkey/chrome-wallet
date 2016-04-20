angular.module('kkWallet')
    .controller('SignTxController', ['$scope', '$routeParams', 'TransactionService', 'NavigationService',
        function ButtonRequestController($scope, $routeParams, transactionService, navigationService) {
            navigationService.setNextTransition('slideRight');
            $scope.buttonRequestType = $routeParams.code;
            $scope.amount = transactionService.transactionInProgress.amount;
            $scope.destination = transactionService.transactionInProgress.address;
            $scope.fee = 'TBD'; //TODO Figure out the fees
        }
    ]);
