/* globals chai, sinon */
window.assert = angular.extend({}, chai.assert, sinon.assert);
window.stub = sinon.stub;

beforeEach(module('kkWallet', function ($provide) {
    this.mockEnvironmentConfig = {
        keepkeyProxy: {
            applicationId: "testProxyId"
        },
        keepkeyWallet: {
            applicationId: "testWalletId"
        }
    };

    $provide.value('environmentConfig', this.mockEnvironmentConfig);
}));

afterEach(function() {
   window.chrome.reset();
});
