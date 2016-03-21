angular.module('kkCommon')
  .factory('NavigationService', ['$location', '$rootScope', '$route', '$timeout',
    function ($location, $rootScope, $route, $timeout) {
      var nextTransition, nextDestination, previousRoute = [];

      function isGoable(path) {
        // NOTE $route.routes is not defined in the API documentation, so this could break
        var route = _.find($route.routes, function(it) {
          return it.regexp && path.match(it.regexp);
        });

        return !!route.goable;
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
          if (_.indexOf(previousRoute, path) !== -1) {
            while (previousRoute.length && previousRoute.pop() !== path);
          }
          previousRoute.push($location.path());
        }

        console.log('navigating from %s to %s with "%s" transition',
          previousRoute.join(' > '), path, $rootScope.pageAnimationClass);

        if (typeof(pageAnimationClass) !== 'undefined') {
          $rootScope.pageAnimationClass = pageAnimationClass;
        }
        else if (typeof(nextTransition) !== 'undefined') {
          $rootScope.pageAnimationClass = nextTransition;
        }
        else {
          $rootScope.pageAnimationClass = 'cross-fade';
        }
        nextTransition = undefined;

        $timeout(function () {
          $rootScope.$digest();
          $location.path(path);
        });
      }

      return {
        go: go,
        goToPrevious: function (pageAnimationClass) {
          go(_.last(previousRoute), pageAnimationClass, true);
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
