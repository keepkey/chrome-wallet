angular.module('kkCommon')
  .directive('hideIfZero', function hideIfZero() {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        scope.$watch(attributes.hideIfZero, function (value) {
          if (value instanceof BigNumber) {
            isHidden = value.eq(0);
          } else if (_.isString(value)) {
            isHidden = !parseFloat(value);
          } else {
            isHidden = !value;
          }

          if (isHidden) {
            element.addClass('ng-hide');
          } else {
            element.removeClass('ng-hide');
          }
        });
      }
    };
  });