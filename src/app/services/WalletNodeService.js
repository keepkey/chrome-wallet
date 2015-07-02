/* global _ */

angular.module('kkWallet')
    .factory('WalletNodeService', ['$rootScope', 'DeviceBridgeService',
        function DeviceFeatureService($rootScope, deviceBridgeService) {
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
            }

            deviceBridgeService.getWalletNodes();

            return {
                wallets: nodes,
                updateWalletNodes: updateWalletNodes
            };
        }
    ])
;