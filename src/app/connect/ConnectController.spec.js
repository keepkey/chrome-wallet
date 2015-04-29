//require('ConnectController.js');

describe('ConnectController', function () {
    var $rootScope, $controller, $q, controller,  mockDeviceBridgeService;

    beforeEach(module('kkWallet'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $q = _$q_;

        $rootScope.go = sinon.stub();

        mockDeviceBridgeService = {
            isDeviceReady: sinon.stub().returns($q.when({result: true}))
        };

        controller = $controller('ConnectController', {
            $rootScope: $rootScope,
            DeviceBridgeService: mockDeviceBridgeService
        });
    }));

    it('when it is started, the connected status of the device is checked', function () {
        $rootScope.$apply()
        sinon.assert.calledOnce(mockDeviceBridgeService.isDeviceReady);
    });

    it('when the device is ready, route to initialize', function () {
        $rootScope.$apply()
        sinon.assert.calledOnce($rootScope.go);
        sinon.assert.calledWith($rootScope.go, '/initialize');
    });
});