/* global _ */

angular.module('kkCommon')
  .factory('WalletNodeService', ['$rootScope', '$timeout', 'DeviceBridgeService',
    function WalletNodeService($rootScope, $timeout, deviceBridgeService) {
      var nodes = [];
      var walletStats = {};

      function updateWalletNodes(newNodes) {
        if (newNodes.length === 0) {
          // Bootstrap the first account
          deviceBridgeService.addAccount('m/44\'/0\'/0\'', 'Main Account');
          return;
        }
        _.each(newNodes, function (node) {
          node.accountNumber = _.trim(_.last(node.nodePath.split('/')), "'");
          var matchingNode = _.find(nodes, {id: node.id});
          if (matchingNode) {
            angular.copy(node, matchingNode);
          } else {
            nodes.push(node);
          }
        });

        setFirstWalletId();

        setTimeout(function () {
          $rootScope.$digest();
        });
      }

      function updateWalletHistory(historyNode) {
        var node = _.find(nodes, {id: historyNode.id});
        if (_.get(node, 'txHist')) {
          angular.copy(historyNode.txHist, node.txHist);
        } else if (node) {
          node.txHist = historyNode.txHist;
        } else {
          nodes.push(historyNode);
        }
        $rootScope.$digest();
      }

      function unusedAddress(walletId, depth) {
        deviceBridgeService.getUnusedExternalAddressNode(walletId, depth);
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
        return _.find(nodes, {id: id});
      }

      function getWalletIndexByHdNode(hdNode) {
        return _.findIndex(nodes, {nodePath: hdNode})
      }

      function setFirstWalletId() {
        walletStats.firstWalletId = !!nodes.length ? 0 : undefined;
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

      function removeAccount(accountId) {
        _.remove(nodes, {id: accountId});
      }

      var getTransactionHistory = deviceBridgeService.getTransactionHistory;

      return {
        wallets: nodes,
        walletStats: walletStats,
        reload: reloadWallets,
        getWalletById: getWalletById,
        updateWalletNodes: updateWalletNodes,
        updateWalletHistory: updateWalletHistory,
        unusedAddress: unusedAddress,
        joinPaths: joinPaths,
        pathToAddressN: pathToAddressN,
        clear: clearData,
        getTransactionHistory: getTransactionHistory,
        loadAccounts: deviceBridgeService.getWalletNodes,
        removeAccount: removeAccount
      };
    }
  ])
;