/* global _ */
const CIN = -1;
const COUT = 1;

angular.module('kkWallet')
    .factory('WalletService', ['$rootScope', 'LocalWrapper',
        function DeviceFeatureService($rootScope, localWrapper) {
            var wallets = [];
            var transactions = [{
                tx_index: 1,
                walletNode: "m/44'/0'/0'",
                addressNode: "0/0",
                hdNode: "m/44'/0'/0'/0/0",
                type: CIN,
                amount: 2.2
            }, {
                tx_index: 2,
                walletNode: "m/44'/0'/0'",
                addressNode: "0/1",
                hdNode: "m/44'/0'/0'/0/1",
                type: COUT,
                amount: 2.2
            }, {
                tx_index: 2,
                walletNode: "m/44'/0'/0'",
                addressNode: "1/0",
                hdNode: "m/44'/0'/0'/1/0",
                type: CIN,
                amount: 1.55
            }, {
                tx_index: 2,
                walletNode: "m/44'/0'/1'",
                addressNode: "0/0",
                hdNode: "m/44'/0'/1'/0/0",
                type: CIN,
                amount: 0.65
            }];

            function getBalance(walletNode) {
                var t = _.filter(transactions, function (it) {
                    return it.walletNode === walletNode;
                })
                return _.reduce(t, function (total, it) {
                    if (it.type === CIN) {
                        return total += it.amount;
                    } else {
                        return total -= it.amount;
                    }
                }, 0);
            }

            localWrapper.get('walletList', function (value) {
                if (value && value.length) {
                    angular.copy(value, wallets);
                }
            });

            $rootScope.$watch(function () {
                return wallets;
            }, function (newVal, oldVal) {
                if (newVal.length) {
                    _.each(wallets, function (it) {
                        it.balance = getBalance(it.hdNode);
                    });
                    localWrapper.set('walletList', wallets);
                }
            }, true);

            return {
                wallets: wallets
            };
        }
    ]);