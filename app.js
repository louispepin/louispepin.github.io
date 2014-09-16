angular.module('app', [
    'ngRoute',
    'app.home',
    'app.snake',
    'app.asteroid'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'dummy.html',
            controller: 'homeCtrl'
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);

angular.module('app.home', [])
.controller('homeCtrl', ['$scope', function($scope) {
    $scope.text = "Home";
}]);

angular.module('app.snake', [])
.controller('snakeCtrl', ['$scope', function($scope) {
    $scope.text = "Snake";
}]);

angular.module('app.asteroid', [])
.controller('asteroidCtrl', ['$scope', function($scope) {
    $scope.text = "Asteroid";
}]);
