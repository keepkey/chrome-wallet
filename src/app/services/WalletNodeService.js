/* global _ */

angular.module('kkWallet')
  .factory('WalletNodeService', ['$rootScope', 'DeviceBridgeService', 'TransactionService',
    function DeviceFeatureService($rootScope, deviceBridgeService, transactionService) {
      var nodes = [];

      function getPublicKeysForNodes(nodes) {
        _.each(nodes, function (it) {
            delete it.chainCode;
            delete it.publicKey;
            delete it.xpub;
            deviceBridgeService.getPublicKey({
              addressN: it.nodePath
            });
          }
        );
        $rootScope.$digest();
      }

      function updateWalletNodes(newNodes) {
        var checkAllNodes = (nodes.length === 0);

        angular.copy(newNodes, nodes);

        // Request public key for nodes where it is missing
        if (checkAllNodes) {
          getPublicKeysForNodes(nodes);
        } else {
          getPublicKeysForNodes(_.filter(nodes, function (it) {
            return !it.xpub;
          }));
        }
        $rootScope.$digest();
      }

      function firstUnusedAddress(addressArray) {
        var unusedAddressNode = _.find(addressArray, function (it) {
          return !transactionService.addressBalances[it.address];
        });
        return unusedAddressNode.address;
      }

      function getAddressNode(walletId, address) {
        var wallet = _.find(nodes, {id: walletId});
        var addresses = _.flatten(wallet.addresses, true);
        var addressNode = _.find(addresses, {address: address});

        var addressNodeString = [wallet.hdNode, addressNode.path].join('/');
        var addressNodes = addressNodeString.split('/');
        if (addressNodes[0] === 'm') {
          addressNodes.shift();
        }
        return _.reduce(addressNodes, function (result, it) {
          var num = parseInt(it);

          if (_.endsWith(it, "'")) {
            num = (num | 0x80000000) >>> 0;
          }

          result.push(num);
          return result;
        }, []);
      }

      function reloadWallets() {
        deviceBridgeService.getWalletNodes();
      }

      function getWalletById(id) {
        if (_.isString(id)) {
          id = parseInt(id, 10);
        }
        return _.find(nodes, {id: id})
      }

      deviceBridgeService.getWalletNodes();

      return {
        wallets: nodes,
        reload: reloadWallets,
        getWalletById: getWalletById,
        updateWalletNodes: updateWalletNodes,
        firstUnusedAddress: firstUnusedAddress,
        getAddressNode: getAddressNode
      };
    }
  ])
;