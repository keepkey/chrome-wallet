angular.module('kkWallet')
  .controller('AccountConfigController', ['$scope', '$routeParams', 'WalletNodeService', 'DeviceFeatureService', 'DeviceBridgeService', 'NotificationMessageService',
    function WalletController($scope, $routeParams, walletNodeService, deviceFeatureService, deviceBridgeService, notificationMessageService) {
      $scope.walletList = walletNodeService.wallets;
      $scope.walletName = '';

      //TODO load the list of assets from the proxy
      $scope.assetTypes = [{
        code: 'btc',
        name: 'Bitcoin',
        coinTypeCode: "0'"
      }, {
        code: 'ltc',
        name: 'Litecoin',
        coinTypeCode: "2'"
      }];


      $scope.selectedAsset = $scope.assetTypes[0];
      $scope.updateAssetType = function() {

      };

      $scope.setAssetType = function(assetType) {
        $scope.assetType = assetType;
        console.log(assetType);
        return false;
      };

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
          deviceBridgeService.addAccount(newAccountNode, $scope.walletName,
            $scope.selectedAsset.name);
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

      function findNextAccountNode(assetType) {
        var newAccountNumber = 0;
        var accounts = _.filter($scope.walletList, {coinType: $scope.selectedAsset.name});
        if (accounts.length) {
          var lastAccount = _.last(_.sortBy(accounts, function (account) {
            return parseInt(account.accountNumber);
          }));
          newAccountNumber = parseInt(lastAccount.accountNumber) + 1;
        }
        return "m/44'/" + $scope.selectedAsset.coinTypeCode + "/" +
          newAccountNumber + "'";
      }
    }
  ]);