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
      $scope.device = deviceFeatureService.features;
      $scope.loaded = !!$scope.wallets.length;
      $scope.fresh = walletNodeService.getFreshStatus();

      walletGroups();

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

      $scope.displayedAccounts = $scope.wallets;

      function walletGroups() {
        $scope.walletGroups = _.map(_.groupBy($scope.wallets, 'coinType'),
          function (wallets, key) {
            return {
              coinType: key,
              wallets: wallets
            }
          }
        );
      }

      $scope.$watch("wallets.length", function () {
        $scope.loaded = !!$scope.wallets.length;
        if ($scope.wallets.length == 1) {
          $scope.go('/wallet/' + $scope.wallets[0].id);
        }
        walletGroups();
      });

    }
  ]);
