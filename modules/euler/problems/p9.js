angular.module('eulerP9', [])
.controller('eulerP9Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {

    $scope.showAnswer = false;

    $scope.calculate = function () {
        var start = new Date().getTime();

        // Euclid's formula for generating Pythagorean triples:
        // a = m^2 - n^2
        // b = 2mn
        // c = m^2 + n^2

        var m = 2;
        var n = 1;
        var a = 0, b = 0, c = 0;

        while (a + b + c != 1000) {
            m = n + 1;
            a = b = c = 0;

            while (a + b + c < 1000) {
                m++;

                a = m*m - n*n;
                b = 2*m*n;
                c = m*m + n*n;
            }

            n++;
        }

        $scope.result = a*b*c;
        $scope.time = new Date().getTime() - start;
        $scope.showAnswer = true;
    };
}]);
