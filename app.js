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
        .when('/games/snake', {
            templateUrl: 'modules/games/snake/snake.html',
            controller: 'snakeCtrl'
        })
        .when('/games/asteroid', {
            templateUrl: 'modules/games/asteroid/asteroid.html',
            controller: 'asteroidCtrl'
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
        .when('/euler/p5', {
            templateUrl: 'modules/euler/problems/p5.html',
            controller: 'eulerP5Ctrl'
        })
        .when('/euler/p6', {
            templateUrl: 'modules/euler/problems/p6.html',
            controller: 'eulerP6Ctrl'
        })
        .when('/euler/p7', {
            templateUrl: 'modules/euler/problems/p7.html',
            controller: 'eulerP7Ctrl'
        })
        .when('/euler/p8', {
            templateUrl: 'modules/euler/problems/p8.html',
            controller: 'eulerP8Ctrl'
        })
        .when('/euler/p9', {
            templateUrl: 'modules/euler/problems/p9.html',
            controller: 'eulerP9Ctrl'
        })
        .when('/euler/p10', {
            templateUrl: 'modules/euler/problems/p10.html',
            controller: 'eulerP10Ctrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);

