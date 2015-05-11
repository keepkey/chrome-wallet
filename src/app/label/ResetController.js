angular.module('kkWallet')
    .controller('ResetController', ['$scope', '$routeParams', 'ResetRecoverRequestModel', 'DeviceBridgeService',
        function ResetController($scope, $routeParams, resetRecoverRequestModel, deviceBridgeService) {
            $scope.resetRecoverData = resetRecoverRequestModel;
            $scope.nextAction = function() {
                if (!$scope.form.$valid) {
                    return false;
                }
                if ($routeParams.nextAction === 'initialize') {
                    deviceBridgeService.resetDevice($scope.resetRecoverData);
                } else if ($routeParams.nextAction === 'recover') {
                    deviceBridgeService.recoverDevice($scope.resetRecoverData);
                } else {
                    console.error('unknown next action:', $routeParams.nextAction);
                }
            };
        }
    ])
    .factory('ResetRecoverRequestModel', function ResetModel() {
        return {
            label: '',
            pin_protection: true,
            password_protection: false,
            word_count: 12,
            language: 'english',
            enforce_wordlist: false
        };
    });
