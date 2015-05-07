angular.module('kkWallet')
    .factory('FailureMessageService', function() {
        var messages = [];
        return {
            get: function() {
                return messages;
            },
            add: function(message) {
                messages.push(message);
            },
            clear: function() {
                messages.length = 0;
            }
        };
    });
