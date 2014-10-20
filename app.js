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
        .when('/euler/p2', {
            templateUrl: 'modules/euler/problems/p2.html',
            controller: 'eulerP2Ctrl'
        })
        .when('/euler/p3', {
            templateUrl: 'modules/euler/problems/p3.html',
            controller: 'eulerP3Ctrl'
        })
        .when('/euler/p4', {
            templateUrl: 'modules/euler/problems/p4.html',
            controller: 'eulerP4Ctrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);

