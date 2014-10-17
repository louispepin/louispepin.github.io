angular.module('app', [
    'ui.bootstrap',
    'ngRoute',
    'games',
    'euler'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/games', {
            templateUrl: 'modules/games/games.html',
            controller: 'gamesCtrl'
        })
        .when('/euler', {
            templateUrl: 'modules/euler/euler.html',
            controller: 'eulerCtrl'
        })
        .when('/euler/p1', {
            templateUrl: 'modules/euler/problems/p1.html',
            controller: 'eulerP1Ctrl'
        })
        .when('/euler/p2', {
            templateUrl: 'modules/euler/problems/p2.html',
            controller: 'eulerP2Ctrl'
        })
        .when('/euler/p3', {
            templateUrl: 'modules/euler/problems/p3.html',
            controller: 'eulerP3Ctrl'
        })
        .otherwise({
            redirectTo: '/euler'
        });
}]);

