/* global _, bitcore */

angular.module('kkWallet')
    .factory('WalletNodeService', ['$rootScope', 'DeviceBridgeService',
        function DeviceFeatureService($rootScope, deviceBridgeService) {
            var nodes = [];

            function calculatePublicKeys() {
                var HDPrivateKey = bitcore.HDPrivateKey;
                var Address = bitcore.Address;
                var Networks = bitcore.Networks;

                var hdPrivateKey = new HDPrivateKey();
                var hdPublicKey = hdPrivateKey.hdPublicKey;

                var addresses = new Address(hdPublicKey.derive(20).publicKey, Networks.livenet);

                console.log('Addresses:', addresses);
            }

            function updateWalletNodes(newNodes) {
                angular.extend(nodes, newNodes);
                // Request public key for nodes where it is missing
                var nodesMissingPublicKey = _.filter(nodes, function (it) {
                    return !nodes.hdNode;
                });
                _.each(nodesMissingPublicKey, function (it) {
                        deviceBridgeService.getPublicKey({
                            addressN: it.nodePath
                        });
                    }
                )
            }

            deviceBridgeService.getWalletNodes();

            return {
                wallets: nodes,
                updateWalletNodes: updateWalletNodes
            };
        }
    ])
;