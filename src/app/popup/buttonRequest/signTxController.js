angular.module('kkWallet')
    .controller('SignTxController', ['$scope', '$routeParams', 'TransactionService', 'NavigationService',
        function ButtonRequestController($scope, $routeParams, transactionService, navigationService) {
            
            if(navigationService.getCurrentRoute() === '/buttonRequest/button_request_sign_tx') {
              navigationService.setNextTransition('slideRight');
            } else {
              navigationService.setNextTransition('slideLeft');
            }
            
            $scope.buttonRequestType = $routeParams.code;
            $scope.amount = transactionService.transactionInProgress.amount;
            $scope.destination = transactionService.transactionInProgress.address;
            $scope.fee = 'TBD'; //TODO Figure out the fees
        }
    ]);
