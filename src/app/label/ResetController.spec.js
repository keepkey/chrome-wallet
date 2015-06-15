/* globals inject, stub, assert */

//require('ConnectController.js');

describe('InitializationController', function () {
    var $rootScope, $controller, controller,  mockInitializationDataService, scope;

    beforeEach(module('kkWallet'));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;

        scope = $rootScope.$new();

        mockInitializationDataService = {
            label: 'mockLabel',
            pin: ''
        };

        controller = $controller('InitializationController', {
            $scope: scope,
            InitializationDataService: mockInitializationDataService
        });
    }));

    it('initialization data is exposed in scope', function () {
        assert.equal(scope.initializationData.label, mockInitializationDataService.label);
    });

    it('appendToPin function adds characters to the pin field in the initializationData object', function() {
        assert.equal(scope.initializationData.pin, '');

        scope.appendToPin(3);

        assert.equal(scope.initializationData.pin, '3');
    });

    it('updates $scope.displayPin when initializationData.pin changes', function() {
        assert.equal(scope.displayPin, '');

        scope.appendToPin(3);
        scope.appendToPin(4);
        scope.appendToPin(5);
        scope.$digest();

        assert.equal(scope.displayPin, '***');
    });
});