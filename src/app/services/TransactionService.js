/* global _ */
const CIN = -1;
const COUT = 1;

angular.module('kkWallet')
    .factory('TransactionService', ['$rootScope', '$indexedDB', 'DataStoreConstants', '$timeout',
        function($rootScope, $indexedDB, ds, $timeout) {
            var transactions = [];
            var observedBalances = [];

            var conn = new WebSocket("wss://ws.chain.com/v2/notifications");
            conn.onopen = function (ev) {
                var req;
                req = {type: "address", address:"1Bxrnvco2xc6AEQjGk8PSUUKF45Nj7WjjV", block_chain: "bitcoin"};
                conn.send(JSON.stringify(req));
                req = {type: "address", address:"1LHW9uJ7AsMrd5mLH2u6ssgBMMoQD9x9nU", block_chain: "bitcoin"};
                conn.send(JSON.stringify(req));
                req = {type: "address", address:"18onzkMtHDedq8Dy13qDbLtCg5s4G7C54a", block_chain: "bitcoin"};
                conn.send(JSON.stringify(req));
            };
            conn.onmessage = function (ev) {
                var x = JSON.parse(ev.data);
                if (x.payload.type === 'heartbeat') {
                    console.log('heartbeat');
                } else {
                    console.log(x.payload);
                }
            };


            $timeout(function() {
                add({
                    tx_index: 1,
                    walletNode: "m/44'/0'/0'",
                    addressNode: "0/0",
                    hdNode: "m/44'/0'/0'/0/0",
                    type: CIN,
                    amount: 5
                });
            }, 5000);

            function observeNodeBalance(walletNode) {
                observedBalances.push(walletNode);
            }

            function updateNodeBalances() {
                _.each(observedBalances, function(node) {
                    var nodeTransactions = _.filter(transactions, function(transaction) {
                        return transaction.walletNode ===  node.hdNode;
                    });

                    node.balance = _.reduce(nodeTransactions, function (total, transaction) {
                        if (transaction.type === CIN) {
                            return total += transaction.amount;
                        } else {
                            return total -= transaction.amount;
                        }
                    }, 0);
                });
            }

            function add(newTransaction) {
                transactions.push(newTransaction);
                updateNodeBalances();
                $indexedDB.openStore(ds.TRANSACTIONS_STORE_NAME, function (store) {
                    store.insert(newTransaction)
                        .catch(function(msg) {
                            console.log('Failed to add new transaction:', msg);
                        });
                });
            }

            $indexedDB.openStore(ds.TRANSACTIONS_STORE_NAME, function (store) {
                store.getAll()
                    .then(function (storedTransactions) {
                        if (storedTransactions.length) {
                            transactions.length = 0;
                            angular.extend(transactions, storedTransactions);
                            updateNodeBalances();
                        }
                    })
                    .catch(function (msg) {
                        console.error('Error getting transactions:', msg);
                    });
            });

            return {
                observeNodeBalance: observeNodeBalance,
                add: add
            };
        }
]);