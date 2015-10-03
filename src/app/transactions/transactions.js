angular.module('kkTransactions', [
  'ngRoute',
  'kkCommon'
])
  .constant('VERSION', '{{VERSION}}')
  .config( ['$compileProvider',
    function( $compileProvider )
    {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome-extension|bitcoin):/);
    }
  ])
  .controller('TransactionListController', ['$scope', 'DeviceBridgeService',
    function TransactionListController($scope, deviceBridgeService) {
      $scope.transactionList = [{
        timestamp: new Date(),
        address: '1stuff',
        received: 10000,
        balance: 10000
      }, {
        date: new Date(),
        address: '1morestuff',
        sent: 20000,
        balance: 5000
      }]
    }
  ]);
