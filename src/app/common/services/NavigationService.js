angular.module('kkCommon')
  .factory('NavigationService', ['$location', '$rootScope', '$route', '$timeout',
    function ($location, $rootScope, $route, $timeout) {
      var nextTransition, nextDestination, previousRoute = [];

      function isGoable(path) {
        var result = {
          goable: false
        };

        // NOTE $route.routes is not defined in the API documentation
        angular.forEach($route.routes, function (value, key) {
          if (value.regexp && path.match(value.regexp)) {
            this.goable = this.goable || angular.isUndefined(value.goable) || value.goable;
          }
        }, result);

        return result.goable;
      }

      function go(path, pageAnimationClass) {

        if (nextDestination) {
          path = nextDestination;
          nextDestination = undefined;
        }

        if (path === $location.path()) {
          return;
        }

        // Keep track of the last 'goable' path
        if (isGoable($location.path())) {
          previousRoute.push($location.path());
        }

        if (typeof(pageAnimationClass) !== 'undefined') {
          $rootScope.pageAnimationClass = pageAnimationClass;
        }
        else if (typeof(nextTransition) !== 'undefined') {
          $rootScope.pageAnimationClass = nextTransition;
        }
        else {
          $rootScope.pageAnimationClass = 'cross-fade';
        }
        console.log('navigating from %s to %s with "%s" transition', previousRoute, path, $rootScope.pageAnimationClass);
        nextTransition = undefined;

        $timeout(function () {
          $rootScope.$digest();
          $location.path(path);
        });
      }

      return {
        go: go,
        goToPrevious: function (pageAnimationClass) {
          go(previousRoute.pop(), pageAnimationClass);
        },
        setNextTransition: function (pageAnimationClass) {
          nextTransition = pageAnimationClass;
        },
        setNextDestination: function (destination) {
          nextDestination = destination;
        },
        getPreviousRoute: function () {
          return _.last(previousRoute);
        },
        getCurrentRoute: function () {
          return $location.path();
        }
      };
    }
  ])
  .run(['$rootScope', 'NavigationService',
    function ($rootScope, navigationService) {
      $rootScope.go = navigationService.go;
    }
  ]);
