angular.module('kkWallet')
    .controller('CharacterRequestController', ['$scope', '$routeParams', 'RecoveryCipherModel',
        function ResetController($scope, $routeParams, recoveryCipherModel) {
            var WORD_LENGTH = 4;

            $scope.model = recoveryCipherModel.getModel();
            $scope.model.currentWord = parseInt($routeParams.word_pos);
            $scope.model.currentCharacterPosition = parseInt($routeParams.character_pos);

            $scope.wordPatterns = [];
            $scope.$watch('$routeParams', function() {
                console.log('param change');
                $scope.wordPatterns.length = 0;

                $scope.model.currentWord = parseInt($routeParams.word_pos);
                $scope.model.currentCharacterPosition = parseInt($routeParams.character_pos);

                for (var i=0, iMax=12; i<iMax; i++) {
                    if (i < $scope.model.currentWord) {
                        $scope.wordPatterns.push('****');
                    } else if (i === $scope.model.currentWord ) {
                        var pattern = new Array($scope.model.currentCharacterPosition + 1).join('*') +
                            new Array(WORD_LENGTH - $scope.model.currentCharacterPosition + 1).join('_');
                        $scope.wordPatterns.push(pattern);
                    } else {
                        $scope.wordPatterns.push('____');
                    }
                }
            });

            $scope.onKeyPress = function(ev) {
                var keyCode = ev.keyCode;

                if (keyCode === 13) {
                    recoveryCipherModel.sendEnter();
                }
                else if (keyCode === 8) {
                    recoveryCipherModel.sendBackspace();
                }
                else if (keyCode === 32 || (keyCode >= 65 && keyCode <= 90 && $scope.model.currentCharacterPosition < WORD_LENGTH)) {
                    var char = String.fromCharCode(keyCode).toLowerCase();
                    recoveryCipherModel.sendCharacter(char);
                }
            };
        }
    ])
    .factory('RecoveryCipherModel', ['DeviceBridgeService',
        function RecoveryCipherModel(deviceBridgeService) {
            var model = {
                currentCharacterPosition: 0,
                currentWord: 0
            };

            return {
                getModel: function () {
                    return model;
                },
                sendCharacter: function (character) {
                    deviceBridgeService.characterAck(character);
                },
                sendEnter: function() {
                    deviceBridgeService.characterAck('', false, true);
                },
                sendBackspace: function() {
                    deviceBridgeService.characterAck('', true, false);
                }
            };
        }
    ]);
