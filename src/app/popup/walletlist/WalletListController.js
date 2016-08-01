angular.module('kkWallet')
  .controller('WalletListController', [
    '$scope', 'DeviceFeatureService', 'DeviceBridgeService',
    'NavigationService', 'WalletNodeService', 'TransactionService',
    'CurrencyLookupService',
    function WalletListController($scope, deviceFeatureService,
                                  deviceBridgeService, navigationService,
                                  walletNodeService, transactionService,
                                  currencyLookupService) {
      $scope.wallets = walletNodeService.wallets;
      $scope.balances = transactionService.walletBalances;
      $scope.device = deviceFeatureService.features;
      $scope.loaded = !!$scope.wallets.length;

      if (!$scope.wallets.length) {
        walletNodeService.loadAccounts();
      }

      if (navigationService.getPreviousRoute() === '/label/initialize') {
        navigationService.setNextTransition('slideLeft');
      } else {
        navigationService.setNextTransition('cross-fade');
      }

      $scope.showWalletList = function () {
        return $scope.loaded && $scope.wallets.length > 1;
      };

      $scope.goWallet = function (wallet) {
        $scope.go('/wallet/' + wallet.id, 'slideLeft');
      };

      $scope.coinTypes = [];
      $scope.displayedAccounts = $scope.wallets;
      $scope.defaultCoinTypeFilterValue = 'ALL';
      $scope.coinTypeFilter = $scope.defaultCoinTypeFilterValue;

      $scope.setCoinTypeFilter = function(coinType) {
        $scope.coinTypeFilter = coinType;
      };

      $scope.isSelectedCoinType = function(account, coinTypeFilter) {
        return coinTypeFilter === $scope.defaultCoinTypeFilterValue ||
          coinTypeFilter === currencyLookupService.getCurrencySymbol(account.coinType);
      };

      $scope.$watch("wallets.length", function () {
        $scope.loaded = !!$scope.wallets.length;
        if ($scope.wallets.length == 1) {
          $scope.go('/wallet/' + $scope.wallets[0].id);
        }
        var coinTypes = _.uniq(_.map($scope.wallets, 'coinType'));

        $scope.coinTypes = _.map(coinTypes,
          function (it) {
            return currencyLookupService.getCurrencySymbol(it);
          }).sort();
      });

    }
  ]);
