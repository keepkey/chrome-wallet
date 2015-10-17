/* global _ */

angular.module('kkCommon')
  .factory('WalletNodeService', ['$rootScope', 'DeviceBridgeService',
    function WalletNodeService($rootScope, deviceBridgeService) {
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
        _.each(newNodes, function (node) {
          var index = getWalletIndexByHdNode(node.hdNode);
          if (nodes[index]) {
            angular.copy(node, nodes[index]);
          } else {
            nodes.push(node);
          }
        });

        setFirstWalletId();

        getPublicKeysForNodes(_.filter(nodes, function (it) {
          return !(it.wallet && it.wallet.xpub);
        }));
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
        var node;

        if (_.isString(id)) {
          id = parseInt(id, 10);
        }
        if (_.isNaN(id)) {
          node = undefined;
        } else {
          var hdNode = ['m', "44'", "0'", id + "'"].join('/');
          node = _.find(nodes, {hdNode: hdNode});
          if (!node) {
            if (nodes.length > id) {
              node = nodes[id];
            }
          }
        }
        return node;
      }

      function getWalletIndexByHdNode(hdNode) {
        return _.findIndex(nodes, {hdNode: hdNode})
      }

      function setFirstWalletId() {
        walletStats.firstWalletId = !!nodes.length ? 0 : undefined;
      }

      function clearData() {
        nodes.length = 0;
        $rootScope.$digest();
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

      var getTransactionHistory = deviceBridgeService.getTransactionHistory;

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
        clear: clearData,
        getTransactionHistory: getTransactionHistory
      };
    }
  ])
;