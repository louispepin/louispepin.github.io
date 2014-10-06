angular.module('app', [
    'ui.bootstrap',
    'ngRoute',
    'home',
    'games',
    'euler'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'modules/home/home.html',
            controller: 'homeCtrl'
        })
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
        .otherwise({
            redirectTo: '/home'
        });
}]);

