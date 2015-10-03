angular.module('kkWallet')
    .directive('focus', function focus(){
        return {
            link: function(scope, element) {
                element[0].focus();
            }
        };
    });