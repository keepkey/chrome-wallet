angular.module('kkWallet')
    .factory('NotificationMessageService', function() {
        var notificationMessage = '';
        return {
            get: function() {
                return notificationMessage;
            },
            set: function(message) {
                notificationMessage = message;
            },
            clear: function() {
                notificationMessage = '';
            }
        };
    });
