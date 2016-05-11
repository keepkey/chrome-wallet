angular.module('kkWallet')
  .factory('ProgressService', ['$rootScope',
    function ProgressService($rootScope) {
      function clear() {
        service.current = 0;
        service.total =0;
      }

      function update(report) {
        service.current = report.current;
        service.total = report.total;

        $rootScope.$apply();
      }
      var service = {
        update: update,
        clear: clear,
        current: 0,
        total: 0
      };
      return service;
    }
  ]);