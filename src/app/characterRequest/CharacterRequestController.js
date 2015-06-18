angular.module('kkWallet')
    .controller('CharacterRequestController', ['$scope', '$routeParams', 'RecoveryCipherModel',
        function CharacterRequestController($scope, $routeParams, recoveryCipherModel) {
            const WORD_LENGTH = 4;

            $scope.getEmptyArray = function (num) {
                return new Array(num);
            };

            $scope.model = recoveryCipherModel.getModel();
            $scope.model.currentWord = parseInt($routeParams.word_pos);
            $scope.model.currentCharacterPosition = parseInt($routeParams.character_pos);

            $scope.wordCount = 12;
            while ($scope.model.currentWord >= $scope.wordCount) {
                $scope.wordCount += 6;
            }
            $scope.wordLength = WORD_LENGTH;
            $scope.sendInProgress = false;

            $scope.getCharAtCurrentPosition = function (wordIndex, positionIndex) {
                if ((wordIndex < $scope.model.currentWord) ||
                    (wordIndex === $scope.model.currentWord &&
                    positionIndex < $scope.model.currentCharacterPosition)) {
                    return '*';
                }
                else if (wordIndex === $scope.model.currentWord &&
                    positionIndex === $scope.model.currentCharacterPosition) {
                    return '|';
                } else {
                    return '-';
                }
            };

            $scope.isCursorPosition = function (wordIndex, characterIndex) {
                return wordIndex === $scope.model.currentWord &&
                    characterIndex === $scope.model.currentCharacterPosition;
            };

            $scope.wordCompleted = function (wordIndex) {
                return wordIndex < $scope.model.currentWord;
            };

            $scope.wordPatterns = [];
            $scope.$watch('$routeParams', function () {
                $scope.model.currentWord = parseInt($routeParams.word_pos);
                $scope.model.currentCharacterPosition = parseInt($routeParams.character_pos);
            });

            $scope.onKeyPress = function (ev) {
                ev.preventDefault();

                if ($scope.sendInProgress) {
                    return;
                }

                var keyCode = ev.keyCode;
                if (keyCode === 13) {
                    if ([11, 17, 23].indexOf($scope.model.currentWord) !== -1 &&
                        $scope.model.currentCharacterPosition >= 3) {
                        $scope.sendInProgress = true;
                        recoveryCipherModel.sendEnter();
                    }
                }
                else if (keyCode === 8) {
                    if ($scope.model.currentWord !== 0 ||
                        $scope.model.currentCharacterPosition !== 0)
                    {
                        $scope.sendInProgress = true;
                        recoveryCipherModel.sendBackspace();
                    }
                }
                else if (keyCode === 32) {
                    if ($scope.model.currentCharacterPosition >= 3 && $scope.model.currentWord !== 23) {
                        $scope.sendInProgress = true;
                        recoveryCipherModel.sendCharacter(' ');
                    }
                }
                else if (keyCode >= 65 && keyCode <= 90) {
                    if ($scope.model.currentCharacterPosition < WORD_LENGTH) {
                        $scope.sendInProgress = true;
                        var char = String.fromCharCode(keyCode).toLowerCase();
                        recoveryCipherModel.sendCharacter(char);
                    }
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
                sendEnter: function () {
                    deviceBridgeService.characterAck('', false, true);
                },
                sendBackspace: function () {
                    deviceBridgeService.characterAck('', true, false);
                }
            };
        }
    ]);
