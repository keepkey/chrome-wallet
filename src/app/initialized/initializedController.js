angular.module('kkWallet')
    .controller('InitializedController', ['$scope', 'DeviceBridgeService', 'NavigationService', 'WalletNodeService', 'TransactionService',
        function InitializedController($scope, deviceBridgeService, navigationService, walletNodeService, transactionService) {
            $scope.wallets = walletNodeService.wallets;
            $scope.balances = transactionService.walletBalances;
            $scope.getBalance = function(node) {
                if (node && $scope.balances && $scope.balances[node] && $scope.balances[node].balance) {
                    return $scope.balances[node].balance / 100000000;
                } else {
                    return '---';
                }
            };
            $scope.getConfirmationTooltip = function(node) {
                if (node && $scope.balances && $scope.balances[node]) {
                    var confirmations = $scope.balances[node].confirmations;

                    var pluralized = 'confirmation' + ((confirmations === 1) ? '' : 's');
                    var quantity = (confirmations >= 10) ? 'More than 10' : '' + confirmations;
                    return quantity + ' ' + pluralized;
                }
            };

            $scope.getConfirmationClasses = function(node) {
                var classes = [];
                if (node && $scope.balances && $scope.balances[node]) {
                    var confirmations = $scope.balances[node].confirmations;
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

            $scope.wipeDevice = function() {
                navigationService.setNextTransition('slideLeft');
                deviceBridgeService.wipeDevice();
            };
        }
    ]);
