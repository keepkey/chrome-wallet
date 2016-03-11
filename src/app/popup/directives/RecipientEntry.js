angular.module('kkWallet')
  .directive('recipientEntry', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        recipient: '=',
        fieldName: '@',
        form: '=',
        disabled: '='
      },
      link: function($scope) {
        $scope.field = _.get($scope.form, $scope.fieldName);
      },
      templateUrl: 'app/popup/directives/RecipientEntry.tpl.html'

    };
  });