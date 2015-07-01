angular.module('kkWallet')
    .constant('DataStoreConstants', {
        DB_NAME: 'blockchain-wallet',
        NODES_STORE_NAME: 'nodes',
        NODES_KEY_PATH: 'id',
        NODES_NAMES_INDEX_NAME: 'name_idx',
        NODES_NAME_PATH: 'name',
        TRANSACTIONS_STORE_NAME: 'transactions',
        TRANSACTIONS_KEY_PATH: 'id',
        TRANSACTIONS_NODE_INDEX_NAME: 'node_idx',
        TRANSACTIONS_NODE_INDEX_PATH: 'walletNode'

    })
    .config(['$indexedDBProvider', 'DataStoreConstants',
        function ($indexedDBProvider, ds) {
            $indexedDBProvider
                .connection(ds.DB_NAME)
                .upgradeDatabase(1, function (event, db, tx) {
                    var objStore;
                    objStore = db.createObjectStore(ds.NODES_STORE_NAME, {
                        keyPath: ds.NODES_KEY_PATH,
                        autoIncrement : true
                    });
                    objStore.createIndex(
                        ds.NODES_NAMES_INDEX_NAME,
                        ds.NODES_NAME_PATH,
                        {unique: false}
                    );

                    objStore = db.createObjectStore(ds.TRANSACTIONS_STORE_NAME, {
                        keyPath: ds.TRANSACTIONS_KEY_PATH,
                        autoIncrement : true
                    });
                    objStore.createIndex(
                        ds.TRANSACTIONS_NODE_INDEX_NAME,
                        ds.TRANSACTIONS_NODE_INDEX_PATH,
                        {unique: false}
                    );
                });
        }
    ]);
