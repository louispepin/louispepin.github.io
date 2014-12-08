angular.module('euler', [
    'eulerP1',
    'eulerP2',
    'eulerP3',
    'eulerP4',
    'eulerP5',
    'eulerP6',
    'eulerP7'
])

.controller('eulerCtrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {
    document.title = "Euler";
}]);
