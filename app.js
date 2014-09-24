angular.module('app', [
    'ui.bootstrap',
    'ngRoute',
    'home',
    'games'
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
        .when('/snake', {
            templateUrl: 'modules/snake/snake.html',
            controller: 'snakeCtrl'
        })
        .when('/asteroid', {
            templateUrl: 'modules/asteroid/asteroid.html',
            controller: 'asteroidCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);

