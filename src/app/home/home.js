kkWallet

// .filter('multiply', function () {
//   return function (value) {
//     return value * 5;
//   }
// })

// .directive('tester', function(){
//   return {
//     restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
//     template: '<div>This is a test directive!!!</div>'
//   };
// })

.controller( 'HomeCtrl', function HomeCtrl( $scope ) {

  $scope.testme = function () {
    return 5;
  }

})

;