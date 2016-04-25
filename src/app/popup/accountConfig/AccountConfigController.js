angular.module('kkWallet')
  .controller('AccountConfigController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceFeatureService', 'DeviceBridgeService', 'NotificationMessageService',
    function WalletController($scope, $routeParams, walletNodeService, deviceFeatureService, deviceBridgeService, notificationMessageService) {
      $scope.walletList = walletNodeService.wallets;
      $scope.walletName = '';

      var wallet = _.find($scope.walletList, {
        id: $routeParams.accountId
      });

      if (wallet) {
        $scope.walletName = wallet.name;
      }

      $scope.device = deviceFeatureService.features;
      $scope.creating = false;
      var startingAccountListCount = $scope.walletList.length;

      $scope.addAccount = function () {
        if ($scope.form.$valid) {
          $scope.creating = true;
          var newAccountNode = findNextAccountNode();
          console.log('new account node path:', newAccountNode);
          notificationMessageService.set('Your new account was successfully created!');
          deviceBridgeService.addAccount(newAccountNode, $scope.walletName);
        }
      };

      $scope.updateAccountName = function () {
        if ($scope.form.$valid) {
          $scope.creating = true;
          notificationMessageService.set('Your account name was successfully updated!');
          deviceBridgeService.updateWalletName(
            $routeParams.accountId, $scope.walletName);
        }
      };

      $scope.$watch('walletList.length', function () {
        if ($scope.walletList.length !== startingAccountListCount) {
          $scope.go('/walletlist', 'slideRight');
        }
      });

      function findNextAccountNode() {
        var lastAccount = _.last(_.sortBy($scope.walletList, function(account) {
          return parseInt(account.accountNumber);
        }));
        var lastAccountNumber = parseInt(lastAccount.accountNumber);
        return "m/44'/0'/" + (lastAccountNumber + 1) + "'";

      }
    }
  ]);