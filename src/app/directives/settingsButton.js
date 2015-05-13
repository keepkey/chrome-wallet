angular.module('kkWallet')
    .directive('settingsButton', function settingsButton(){
        return {
            restrict: 'E',
            replace: true,
            template: '<a class="settings-button"><div class="icon icon-settings"></div></a>'
        };
    });