angular.module('eulerP6', [])
.controller('eulerP6Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {

    $scope.showAnswer = false;

    $scope.calculate = function () {
        var start = new Date().getTime();

        var sumOfSquares = 0;
        var squareOfSums = 0;

        for (var i = 1; i < 101; i++) {
            sumOfSquares += i*i;
        }

        for (i = 1; i < 101; i++) {
            squareOfSums += i;
        }
        squareOfSums *= squareOfSums;

        $scope.result = squareOfSums - sumOfSquares;
        $scope.time = new Date().getTime() - start;
        $scope.showAnswer = true;
    };
}]);
