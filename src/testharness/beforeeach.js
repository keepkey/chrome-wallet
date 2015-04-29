window.assert = chai.assert;
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

beforeEach(module('kkWallet'));
