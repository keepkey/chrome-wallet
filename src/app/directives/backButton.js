angular.module('kkWallet')
    .directive('backButton', function backButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                destination: '=',
                animation: '=?'
            },
            controller: ['$scope', 'NavigationService',
                function ($scope, navigationService) {
                    $scope.go = navigationService.go;
                    if(!$scope.animation) {
                        $scope.animation = 'slideRight';
                    }
                }
            ],
            template: '<a class="back-button" ng-click="go(destination, animation)">' +
                    '<div class="icon icon-back"></div>' +
                '</a>'
        };
    });