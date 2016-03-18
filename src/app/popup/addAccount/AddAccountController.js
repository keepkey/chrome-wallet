angular.module('kkWallet')
  .controller('AddAccountController', ['$scope', 'WalletNodeService', 'DeviceFeatureService', 'TransactionService', 'DeviceBridgeService',
    function WalletController($scope, walletNodeService, deviceFeatureService, transactionService, deviceBridgeService) {
      $scope.walletName = '';
      $scope.walletList = walletNodeService.wallets;
      $scope.device = deviceFeatureService.features;
      $scope.creating = false;
      var startingAccountListCount = $scope.walletList.length;

      $scope.addAccount = function () {
        if ($scope.form.$valid) {
          $scope.creating = true;
          var newAccountNode = findNextAccountNode();
          deviceBridgeService.addAccount(newAccountNode, $scope.walletName);
        }
      };

      $scope.$watch('walletList.length', function () {
        console.log('valid:', form.$valid);
        if ($scope.walletList.length > startingAccountListCount) {
          $scope.go('/walletList', 'slideLeft');
        }
      });

      function findNextAccountNode() {
        var candidateAccount = 0;
        while (_.find($scope.walletList, {
          nodePath: "m/44'/0'/" + candidateAccount + "'"
        })) {
          candidateAccount++;
        }

        return "m/44'/0'/" + candidateAccount + "'";
      }


    }
  ]);