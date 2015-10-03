/* globals assert, inject, chrome, stub, sinon  */
//require('DeviceBridgeService.js');

describe('DeviceBridgeService', function () {
    var service, $rootScope;
    var mockNavigationService;

    beforeEach(module('kkWallet', function ($provide) {
        mockNavigationService = {
            go: stub()
        };

        $provide.value('NavigationService', mockNavigationService);
    }));

    beforeEach(inject(function (DeviceBridgeService) {
        service = DeviceBridgeService;
    }));

    beforeEach(inject(function (_$rootScope_) {
        $rootScope = _$rootScope_;
    }));

    describe('deviceReady', function () {
        it('has a deviceReady() function', function () {
            assert.isFunction(service.isDeviceReady);
        });

        it('reports when the device is ready', function (done) {
            service.isDeviceReady().then(function (result) {
                assert.isTrue(result);
                assert.calledOnce(chrome.runtime.sendMessage);
                assert.calledWith(chrome.runtime.sendMessage,
                    this.mockEnvironmentConfig.keepkeyProxy.applicationId,
                    {messageType: "deviceReady"},
                    {},
                    sinon.match.func
                );
                done();
            });

            chrome.runtime.sendMessage.callArgWith(3, true);

            $rootScope.$apply();
        });
    });

    describe('startListener', function () {
        var messageListener;

        beforeEach(function () {
            assert.calledOnce(chrome.runtime.onMessageExternal.addListener);
            messageListener = chrome.runtime.onMessageExternal.addListener.args[0][0];
        });

        it('registers an external message listener when called', function () {
            assert.isFunction(messageListener);
        });

        it('returns an error message to the sender when the sender is unknown', function () {
            var senderResponseStub = stub();
            var mockSender = {
                id: 'clandestineExtension'
            };
            messageListener({}, mockSender, senderResponseStub);

            assert.calledOnce(senderResponseStub);
            assert.calledWith(senderResponseStub, sinon.match({
                messageType: "Error",
                result: sinon.match(function(value) {
                    return (value.indexOf(mockSender.id) !== -1);
                }, 'contains sender id')
            }));
        });

        it('returns an error message to the sender when the message type is unknown', function () {
            var senderResponseStub = stub();
            var mockSender = {
                id: 'testProxyId'
            };
            var mockMessage = {
                messageType: 'bogus'
            };

            messageListener(mockMessage, mockSender, senderResponseStub);

            assert.calledOnce(senderResponseStub);
            assert.calledWith(senderResponseStub, sinon.match({
                messageType: "Error",
                result: sinon.match(function(value) {
                    return (value.indexOf(mockMessage.messageType) !== -1);
                }, 'contains message type')
            }));
        });

        describe('on connected message', function() {
            var senderResponseStub;
            var mockSender;

            beforeEach(function() {
                senderResponseStub = stub();
                mockSender = {
                    id: 'testProxyId'
                };
                stub($rootScope, '$digest');
            });

            afterEach(function() {
                assert.notCalled(senderResponseStub);
            });

            it('sends the initialize() request to the device proxy', function () {
                var initializeSpy = sinon.spy(service, 'initialize');

                var mockMessage = {
                    messageType: 'connected'
                };

                messageListener(mockMessage, mockSender, senderResponseStub);

                assert.calledOnce(initializeSpy);
                assert.calledWith(initializeSpy);

                initializeSpy.restore();
            });
        });

        describe('messages that route to another page', function () {
            var senderResponseStub;
            var mockSender;

            beforeEach(function() {
                senderResponseStub = stub();
                mockSender = {
                    id: 'testProxyId'
                };
                stub($rootScope, '$digest');
            });

            afterEach(function() {
                assert.notCalled(senderResponseStub);
                assert.calledOnce(mockNavigationService.go);
                assert.calledOnce($rootScope.$digest);

                $rootScope.$digest.restore();
            });

            it('navigates to "/connect" when a "disconnected" message is received', function () {
                var mockMessage = {
                    messageType: 'disconnected'
                };

                messageListener(mockMessage, mockSender, senderResponseStub);

                assert.calledWith(mockNavigationService.go, '/connect');
            });
        });
    });
});