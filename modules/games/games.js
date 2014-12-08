angular.module('games', ['snake', 'asteroid'])
.controller('gamesCtrl', ['$scope', '$rootScope', function($scope, $rootScope, $modal) {
    document.title = "Games";
}]);

