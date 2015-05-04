angular.module('kkWallet')
    .controller('ResetController', ['$scope', 'ResetModel', 'DeviceBridgeService',
        function ResetController($scope, ResetModel, DeviceBridgeService) {
            $scope.resetData = ResetModel;
            $scope.sendLabelToDevice = function() {
                if (!$scope.form.$valid) {
                    return false;
                }
                DeviceBridgeService.resetDevice($scope.resetData);
            };
        }
    ])
    .factory('ResetModel', function ResetModel() {
        return {
            label: '',
            pin_protection: true,
            password_protection: false
        };
    });
