angular.module('kkWallet')
  .directive('feeSelector', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        estimatedFees: '=',
        selected: '=',
        active: '='
      },
      controller: ['$scope', 'FeeService',
        function ($scope, feeService) {
          function verifyFeeLevel() {
            var translation = {
              'fast': 'medium',
              'medium': 'slow',
              'slow': 'slow'
            };

            if (_.get($scope, 'estimatedFees.length')) {
              while (_.isUndefined($scope.estimatedFee[$scope.userInput.feeLevel])) {
                $scope.userInput.feeLevel = translation[$scope.userInput.feeLevel];
                if ($scope.userInput.feeLevel === 'slow') {
                  break;
                }
              }
            }
          }

          $scope.feeDisplay = {
            'slow': '1-hour +',
            'medium': '30-min',
            'fast': '10-min'
          };
          $scope.fees = feeService.fees;
          $scope.feeOptions = feeService.feeOptions;

          $scope.$watch('estimatedFees', verifyFeeLevel, true);
        }
      ],
      templateUrl: 'app/popup/directives/FeeSelector.tpl.html'

    };
  });