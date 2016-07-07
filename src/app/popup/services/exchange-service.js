angular.module('kkWallet')
  .factory('ExchangeService', ['$rootScope',
    function ExchangeService($rootScope) {
      var data;

      function set(messageData) {
        data = _(messageData);
      }

      function getValue(path) {
        if (data && path) {
          return data.get(path);
        } else {
          return undefined;
        }
      }

      function getData() {
        return data;
      }

      var service = {
        set: set,
        get: getValue,
        getRequest: getData
      };
      return service;
    }
  ]);
