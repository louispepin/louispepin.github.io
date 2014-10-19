angular.module('eulerP3', [])
.controller('eulerP3Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {

    $scope.showAnswer = false;

    $scope.calculate = function () {
        var start = new Date().getTime();
        var largeNumber = 600851475143;
        var biggestPrime = 2;

        for (var i = 2; i * i < largeNumber; i++) {
            if (largeNumber % i == 0) {
                var prime = true;
                for (var j = 2; j * j < i; j++) {
                    if (i % j == 0)
                        prime = false;
                }

                if (prime && i > biggestPrime)
                    biggestPrime = i;
            }
        }

        $scope.result = biggestPrime;
        $scope.time = new Date().getTime() - start;
        $scope.showAnswer = true;
    };
}]);
