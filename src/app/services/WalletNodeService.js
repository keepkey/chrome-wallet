/* global _ */

angular.module('kkWallet')
    .factory('WalletNodeService', ['$rootScope', 'DeviceBridgeService', 'TransactionService',
        function DeviceFeatureService($rootScope, deviceBridgeService, transactionService) {
            var nodes = [];

            function updateWalletNodes(newNodes) {
                angular.extend(nodes, newNodes);
                // Request public key for nodes where it is missing
                var nodesMissingPublicKey = _.filter(nodes, function (it) {
                    return !it.xpub;
                });
                _.each(nodesMissingPublicKey, function (it) {
                        deviceBridgeService.getPublicKey({
                            addressN: it.nodePath
                        });
                    }
                )
                $rootScope.$digest();
            }

            function firstUnusedAddress(addressArray) {
                var unusedAddressNode = _.find(addressArray, function(it) {
                    return !transactionService.addressBalances[it.address];
                });
                return unusedAddressNode.address;
            }

            deviceBridgeService.getWalletNodes();

            return {
                wallets: nodes,
                updateWalletNodes: updateWalletNodes,
                firstUnusedAddress: firstUnusedAddress
            };
        }
    ])
;