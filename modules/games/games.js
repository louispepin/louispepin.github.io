angular.module('games', ['snake', 'asteroid'])
.controller('gamesCtrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {
    $scope.actions = {
        openSnake: function () {
            var modalInstance = $modal.open({
                templateUrl: 'modules/games/snake/snake.html',
                controller: 'snakeCtrl',
                size: 'lg'
            })

            $rootScope.snakeModalReady = false;
            modalInstance.opened.then(function() {
                $rootScope.snakeModalReady = true;
            });
            modalInstance.result.then(function () {
                $rootScope.snakeModalReady = false;
            });
        },
        openAsteroid: function () {
            var modalInstance = $modal.open({
                templateUrl: 'modules/games/asteroid/asteroid.html',
                controller: 'asteroidCtrl',
                size: 'lg'
            })

            $rootScope.asteroidModalReady = false;
            modalInstance.opened.then(function() {
                $rootScope.asteroidModalReady = true;
            });
            modalInstance.result.then(function () {
                $rootScope.asteroidModalReady = false;
            });
        }
    };
}]);

