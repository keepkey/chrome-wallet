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

        if (path.toLowerCase() === $location.path().toLowerCase()) {
          return;
        }

        if (_.indexOf(previousRoute, path) !== -1) {
          while (previousRoute.length && previousRoute.pop() !== path);
        } else if (isGoable($location.path())) {
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
          var destination = _.last(previousRoute);
          if (destination) {
            go(destination, pageAnimationClass, true);
          }
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
        },
        dumpHistory: function() {
          previousRoute.length = 0;
        },
        hasPreviousRoute: function() {
          return !!_.last(previousRoute);
        },
        addHistory: function(route) {
          previousRoute.push(route);
        }
      };
    }
  ])
  .run(['$rootScope', 'NavigationService',
    function ($rootScope, navigationService) {
      $rootScope.go = navigationService.go;
    }
  ]);
