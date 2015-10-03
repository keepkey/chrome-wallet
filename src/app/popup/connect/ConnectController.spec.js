/* globals inject, stub, assert */

//require('ConnectController.js');

describe('ConnectController', function () {
    var scope, controller,  mockDeviceBridgeService;

    beforeEach(module('kkWallet'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
        scope = _$rootScope_.$new();

        mockDeviceBridgeService = {
            isDeviceReady: stub().returns(_$q_.when({result: true})),
            initialize: stub()
        };

        controller = _$controller_('ConnectController', {
            $scope: scope,
            DeviceBridgeService: mockDeviceBridgeService
        });
    }));

    it('when it is started, the connected status of the device is checked', function () {
        scope.$digest();
        assert.calledOnce(mockDeviceBridgeService.isDeviceReady);
    });

    it('when the device is ready, call the initialize function', function () {
        scope.$digest();
        assert.calledOnce(mockDeviceBridgeService.initialize);
    });
});