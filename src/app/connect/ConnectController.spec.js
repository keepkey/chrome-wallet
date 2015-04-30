/* globals inject, stub, assert */

//require('ConnectController.js');

describe('ConnectController', function () {
    var $rootScope, $controller, $q, controller,  mockDeviceBridgeService, mockNav;

    beforeEach(module('kkWallet'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $q = _$q_;

        mockNav = {
            go: stub()
        }

        mockDeviceBridgeService = {
            isDeviceReady: stub().returns($q.when({result: true}))
        };

        controller = $controller('ConnectController', {
            $rootScope: $rootScope,
            DeviceBridgeService: mockDeviceBridgeService,
            NavigationService: mockNav
        });
    }));

    it('when it is started, the connected status of the device is checked', function () {
        $rootScope.$apply();
        assert.calledOnce(mockDeviceBridgeService.isDeviceReady);
    });

    it('when the device is ready, route to initialize', function () {
        $rootScope.$apply();
        assert.calledOnce(mockNav.go);
        assert.calledWith(mockNav.go, '/initialize');
    });
});