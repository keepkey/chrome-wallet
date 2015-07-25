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
                );
                angular.copy(newNodes, nodes);
                $rootScope.$digest();
            }

            function firstUnusedAddress(addressArray) {
                var unusedAddressNode = _.find(addressArray, function(it) {
                    return !transactionService.addressBalances[it.address];
                });
                return unusedAddressNode.address;
            }

            function getAddressNode(walletId, address) {
                var wallet = nodes[walletId];
                var addresses = _.flatten(wallet.addresses, true);
                var addressNode = _.find(addresses, {address: address});

                var addressNodeString = [wallet.hdNode, addressNode.path].join('/');
                var addressNodes = addressNodeString.split('/');
                if (addressNodes[0] === 'm') {
                    addressNodes.shift();
                }
                return _.reduce(addressNodes, function(result, it) {
                    var num = parseInt(it);

                    if (_.endsWith(it, "'")) {
                        num = (num | 0x80000000) >>> 0;
                    }

                    result.push(num);
                    return result;
                }, []);
            }

            deviceBridgeService.getWalletNodes();

            return {
                wallets: nodes,
                updateWalletNodes: updateWalletNodes,
                firstUnusedAddress: firstUnusedAddress,
                getAddressNode: getAddressNode
            };
        }
    ])
;