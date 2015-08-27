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
        setTimeout(function () {
          $rootScope.$digest();
        });
      }

      function updateWalletNodes(newNodes) {
        var checkAllNodes = (nodes.length === 0);

        _.each(newNodes, function(node) {
          var index = getWalletIndexByHdNode(node.hdNode);
          if (nodes[index]) {
            angular.copy(node, nodes[index]);
          } else {
            nodes.push(node);
          }
        });

        // Request public key for nodes where it is missing
        if (checkAllNodes) {
          getPublicKeysForNodes(nodes);
        } else {
          getPublicKeysForNodes(_.filter(nodes, function (it) {
            return !it.xpub;
          }));
        }
        setTimeout(function () {
          $rootScope.$digest();
        });
      }

      function firstUnusedAddress(walletId) {
        var wallet = getWalletById(walletId);
        if (wallet && wallet.addresses && wallet.addresses.length) {
          var unusedAddressNode = _.find(wallet.addresses[0], function (it) {
            return !transactionService.addressBalances[it.address];
          });
          return unusedAddressNode.address;
        }
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

      function reloadWallets(clearAddresses) {
        _.each(nodes, function (it) {
          delete it.chainCode;
          delete it.publicKey;
          delete it.xpub;
          if (clearAddresses && it.addresses && it.addresses.length) {
            it.addresses.length = 0;
          }
        });
        deviceBridgeService.getWalletNodes();
        setTimeout(function () {
          $rootScope.$digest();
        });
      }

      function getWalletById(id) {
        if (_.isString(id)) {
          id = parseInt(id, 10);
        }
        return _.find(nodes, {id: id})
      }

      function getWalletIndexByHdNode(hdNode) {
        return _.findIndex(nodes, {hdNode: hdNode})
      }

      function getFirstWalletId() {
        return _.reduce(nodes, function(result, wallet) {
          return Math.min(result, wallet.id);
        }, 9999999);
      }

      function clearData() {
        nodes.length = 0;
      }

      deviceBridgeService.getWalletNodes();

      return {
        wallets: nodes,
        reload: reloadWallets,
        getWalletById: getWalletById,
        updateWalletNodes: updateWalletNodes,
        firstUnusedAddress: firstUnusedAddress,
        getAddressNode: getAddressNode,
        getFirstWalletId: getFirstWalletId,
        clear: clearData
      };
    }
  ])
;