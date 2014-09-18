angular.module('app', [
    'ngRoute',
    'home',
    'snake',
    'asteroid'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'modules/home/home.html',
            controller: 'homeCtrl'
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

