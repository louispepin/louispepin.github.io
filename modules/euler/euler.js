angular.module('euler', [
    'eulerP1',
    'eulerP2',
    'eulerP3',
    'eulerP4'
])

.controller('eulerCtrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {
    document.title = "Euler";
}]);
