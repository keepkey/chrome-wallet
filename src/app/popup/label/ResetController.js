angular.module('kkWallet')
    .controller('ResetController', ['$scope', '$routeParams', 'ResetRecoverRequestModel', 'DeviceBridgeService', 'NavigationService', 'DeviceFeatureService',
        function ResetController($scope, $routeParams, resetRecoverRequestModel, deviceBridgeService, navigationService, deviceFeatureService) {
            $scope.resetRecoverData = resetRecoverRequestModel;
            $scope.changeLabel = ($routeParams.nextAction === 'settings');
            $scope.label = '';

            $scope.resetRecoverData.label = deviceFeatureService.features.label;

            $scope.nextAction = function() {
                if (!$scope.form.$valid) {
                    return false;
                }

                navigationService.setNextTransition('slideLeft');

                if ($routeParams.nextAction === 'initialize') {
                    deviceBridgeService.resetDevice($scope.resetRecoverData);
                } else if ($routeParams.nextAction === 'recover') {
                    deviceBridgeService.recoverDevice($scope.resetRecoverData);
                } else if ($routeParams.nextAction === 'settings') {
                    deviceBridgeService.applySettings({'label': $scope.resetRecoverData.label});
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
            enforce_wordlist: true,
            use_character_cipher: true
        };
    });
