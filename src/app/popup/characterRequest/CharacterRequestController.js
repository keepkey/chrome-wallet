angular.module('kkWallet')
  .controller('CharacterRequestController', ['$scope', '$routeParams', '$timeout', 'RecoveryCipherModel',
    function CharacterRequestController($scope, $routeParams, $timeout, recoveryCipherModel) {
      const WORD_LENGTH = 4;

      $scope.getEmptyArray = function (num) {
        return new Array(num);
      };
      $scope.getColumnArray = function (num, columnIndex) {
        var selectedIndexes = [];
        var columnMax = Math.ceil(num / 3);
        var columnStart = columnIndex * columnMax;
        var columnEnd = Math.min(num, columnStart + columnMax - 1);
        for (var i = columnStart; i <= columnEnd; i++) {
          selectedIndexes.push(i);
        }
        return selectedIndexes;
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

      $scope.spaceBarClasses = {
        error: false,
        disabled: $scope.model.currentCharacterPosition < 3 || $scope.model.currentWord === 23,
        active: false
      };
      $scope.spaceBarIcon = $scope.spaceBarClasses.disabled ? 'fa-times' : 'fa-check';

      $scope.letterClasses = {
        error: false,
        disabled: $scope.model.currentCharacterPosition >= WORD_LENGTH,
        active: false
      };
      $scope.letterIcon = $scope.letterClasses.disabled ? 'fa-times' : 'fa-check';

      $scope.backspaceClasses = {
        active: false,
        error: false,
        disabled: $scope.model.currentWord === 0 && $scope.model.currentCharacterPosition === 0
      };
      $scope.backspaceIcon = $scope.backspaceClasses.disabled ? 'fa-times' : 'fa-check';

      $scope.enterClasses = {
        active: false,
        error: false,
        disabled: [11, 17, 23].indexOf($scope.model.currentWord) === -1 ||
        $scope.model.currentCharacterPosition < 3
      };
      $scope.enterIcon = $scope.enterClasses.disabled ? 'fa-times' : 'fa-check';

      $scope.moreWordsAvailable =
        [11, 17].indexOf($scope.model.currentWord) !== -1 &&
        $scope.model.currentCharacterPosition >= 3;

      function setTemporarily(keyClasses, property) {
        keyClasses[property] = true;
        $timeout(function () {
          keyClasses[property] = false;
        }, 200);
      }

      function keyFeedback(keyClasses, sendMessageFunction) {
        if (!keyClasses.disabled) {
          $scope.sendInProgress = true;
          keyClasses.active = true;
          setTemporarily(keyClasses, 'active');
          sendMessageFunction();
        } else {
          setTemporarily(keyClasses, 'error');
        }
      }

      $scope.onKeyPress = function (ev) {
        ev.preventDefault();

        if ($scope.sendInProgress) {
          return;
        }

        var keyCode = ev.keyCode;
        if (keyCode === 13) {
          keyFeedback($scope.enterClasses, function () {
            recoveryCipherModel.sendEnter();
          });
        }
        else if (keyCode === 8) {
          keyFeedback($scope.backspaceClasses, function () {
            recoveryCipherModel.sendBackspace();
          });
        }
        else if (keyCode === 32) {
          keyFeedback($scope.spaceBarClasses, function () {
            recoveryCipherModel.sendCharacter(' ');
          });
        }
        else if (keyCode >= 65 && keyCode <= 90) {
          keyFeedback($scope.letterClasses, function () {
            recoveryCipherModel.sendCharacter(String.fromCharCode(keyCode).toLowerCase());
          });
        }
      };

      $scope.send = recoveryCipherModel.sendEnter;
    }
  ])
  .factory('RecoveryCipherModel', ['DeviceBridgeService', 'NavigationService',
    function RecoveryCipherModel(deviceBridgeService, navigationService) {
      var model = {
        currentCharacterPosition: 0,
        currentWord: 0
      };

      return {
        getModel: function () {
          return model;
        },
        sendCharacter: function (character) {
          navigationService.setNextTransition('noAnimation');
          deviceBridgeService.characterAck(character);
        },
        sendEnter: function () {
          navigationService.setNextTransition('slideLeft');
          deviceBridgeService.characterAck('', false, true);
        },
        sendBackspace: function () {
          navigationService.setNextTransition('noAnimation');
          deviceBridgeService.characterAck('', true, false);
        }
      };
    }
  ]);
