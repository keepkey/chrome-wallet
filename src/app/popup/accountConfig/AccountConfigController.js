angular.module('kkWallet')
  .controller('AccountConfigController', [
    '$scope', '$routeParams', 'WalletNodeService', 'DeviceFeatureService',
    'DeviceBridgeService', 'NotificationMessageService',
    'CurrencyLookupService',
    function WalletController($scope, $routeParams, walletNodeService,
                              deviceFeatureService, deviceBridgeService,
                              notificationMessageService,
                              currencyLookupService) {
      $scope.walletList = walletNodeService.wallets;
      $scope.walletName = '';

      $scope.assetTypes = currencyLookupService.getCurrencyTypes();

      $scope.selectedAsset = 'Bitcoin';

      $scope.setAssetType = function (assetType) {
        $scope.selectedAsset = assetType;
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
          var lastAccount = getLastAccount();
          if (lastAccount && !lastAccount.hasTransactionHistory) {
            $scope.go(
              '/failure/bip44_account_gap_violation/' + lastAccount.name,
              'slideLeft');
          } else {
            var newAccountNode = findNextAccountNode(lastAccount);
            console.log('new account node path:', newAccountNode);
            notificationMessageService.set('Your new account was successfully created!');
            deviceBridgeService.addAccount(newAccountNode, $scope.walletName,
              $scope.selectedAsset);
          }
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

      function getLastAccount() {
        var newAccountNumber = 0;
        var accounts = _.filter($scope.walletList, {
          coinType: $scope.selectedAsset
        });
        return _.last(_.sortBy(accounts, function (account) {
          return parseInt(account.accountNumber);
        }));
      }

      function findNextAccountNode(lastAccount) {
        var newAccountNumber = 0;
        if (!_.isUndefined(lastAccount)) {
          newAccountNumber = parseInt(lastAccount.accountNumber) + 1;
        }
        return [
          "m", "44'",
          currencyLookupService.getCurrencyCode($scope.selectedAsset),
          newAccountNumber + "'"
        ].join('/');
      }
    }
  ]);