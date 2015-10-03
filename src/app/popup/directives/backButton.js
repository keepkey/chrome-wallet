angular.module('kkWallet')
    .directive('backButton', function backButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                destination: '=?',
                animation: '=?',
                action: '&?'
            },
            controller: ['$scope', 'NavigationService',
                function ($scope, navigationService) {
                    if(!$scope.animation) {
                        $scope.animation = 'slideRight';
                    }
                    if ($scope.destination) {
                        $scope.actionFunction = function() {
                            navigationService.go($scope.destination, $scope.animation);
                        };
                    } else {
                        $scope.actionFunction = $scope.action;
                    }
                }
            ],
            template: '<a class="back-button" ng-click="actionFunction()">' +
                    '<div class="icon icon-back"></div>' +
                '</a>'
        };
    });