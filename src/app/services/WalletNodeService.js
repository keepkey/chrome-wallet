/* global _ */

angular.module('kkWallet')
  .factory('WalletNodeService', ['$rootScope', 'DeviceBridgeService', 'TransactionService',
    function DeviceFeatureService($rootScope, deviceBridgeService, transactionService) {
      var nodes = [];
      var walletStats = {};

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

        setFirstWalletId();

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
        deviceBridgeService.getUnusedExternalAddressNode(walletId);
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

      function setFirstWalletId() {
        const MAX_WALLET_ID = 9999999;
        walletStats.firstWalletId =  _.reduce(nodes, function(result, wallet) {
          return Math.min(result, wallet.id);
        }, MAX_WALLET_ID);
        if (walletStats.firstWalletId === MAX_WALLET_ID) {
          walletStats.firstWalletId = undefined;
        }
      }

      function clearData() {
        nodes.length = 0;
      }

      function joinPaths() {
        return 'm/' + _.map(arguments, function (path) {
            return _.trim(path, 'm/');
          }).join('/');
      }

      function pathToAddressN(path) {
        var segments = path.split('/');
        if (segments[0] === 'm') {
          segments.shift();
        }
        return _.reduce(segments, function (result, it) {
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
        walletStats: walletStats,
        reload: reloadWallets,
        getWalletById: getWalletById,
        updateWalletNodes: updateWalletNodes,
        firstUnusedAddress: firstUnusedAddress,
        joinPaths: joinPaths,
        pathToAddressN: pathToAddressN,
        clear: clearData
      };
    }
  ])
;