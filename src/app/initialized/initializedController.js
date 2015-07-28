angular.module('kkWallet')
  .controller('InitializedController', ['$scope', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
    function InitializedController($scope, deviceBridgeService, navigationService, walletNodeService, transactionService) {
      $scope.wallets = walletNodeService.wallets;
      $scope.balances = transactionService.walletBalances;
      $scope.getBalance = function (nodePath) {
        if (nodePath && $scope.balances && $scope.balances[nodePath] && $scope.balances[nodePath].balance) {
          return $scope.balances[nodePath].balance / 100000000;
        } else {
          return '---';
        }
      };
      $scope.getConfirmationTooltip = function (nodePath) {
        if (nodePath && $scope.balances && $scope.balances[nodePath]) {
          var confirmations = $scope.balances[nodePath].confirmations;

          var pluralized = 'confirmation' + ((confirmations === 1) ? '' : 's');
          var quantity = (confirmations >= 10) ? 'More than 10' : '' + confirmations;
          return quantity + ' ' + pluralized;
        }
      };

      $scope.getConfirmationClasses = function (nodePath) {
        var classes = [];
        if (nodePath && $scope.balances && $scope.balances[nodePath]) {
          var confirmations = $scope.balances[nodePath].confirmations;
          if (confirmations < 6) {
            classes.push('fa-circle-o-notch');

            if (confirmations === 0) {
              classes.push('red');
            } else {
              classes.push('yellow');
            }

            var rotation = 60 * confirmations;
            classes.push('rotate' + rotation);
          } else {
            classes.push('fa-check green');
          }

        } else {
          classes.push('fa-ban red');
        }

        return classes.join(' ');
      };

      $scope.walletAddress = function (walletId) {
        var walletNode = $scope.wallets &&
          $scope.wallets.length &&
          _.find($scope.wallets, {id: walletId});

        if (walletNode &&
          walletNode.addresses &&
          walletNode.addresses.length) {
          return walletNodeService.firstUnusedAddress(walletNode.addresses[0]);
        }
      };

      $scope.wipeDevice = function () {
        navigationService.setNextTransition('slideLeft');
        deviceBridgeService.wipeDevice();
      };

      $scope.refresh = function () {
        deviceBridgeService.getTransactions(true);
      };

      $scope.goReceive = function (address, walletId) {
        $scope.go(['/receive', walletId, address].join('/'), 'slideLeft');
      };

    }
  ]);
