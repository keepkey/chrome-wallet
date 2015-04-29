//require('DeviceBridge.js');

describe('DeviceBridge', function () {
    var service, $rootScope;

    beforeEach(inject(function(DeviceBridge){
        service = DeviceBridge;
    }));

    beforeEach(inject(function(_$rootScope_) {
        $rootScope = _$rootScope_;
    }));

    it('has a deviceReady() function', function () {
        assert.isFunction(service.isDeviceReady);
    });

    it('reports when the device is ready', function(done) {
        service.isDeviceReady().then(function(result) {
            assert.isTrue(result);
            sinon.assert.calledOnce(chrome.runtime.sendMessage);
            sinon.assert.calledWith(chrome.runtime.sendMessage,
                mockEnvironmentConfig.keepkeyProxy.applicationId,
                {messageType: "deviceReady"},
                sinon.match.func
            );
            done();
        });

        chrome.runtime.sendMessage.callArgWith(2, true);

        $rootScope.$apply();
    });
});