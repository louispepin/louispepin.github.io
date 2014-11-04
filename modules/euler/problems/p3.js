angular.module('eulerP3', [])
.controller('eulerP3Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {

    $scope.showAnswer = false;

    $scope.calculate = function () {
        var start = new Date().getTime();

        var isPrime = function (x) {
            var prime = true;
            for (var i = 2; i * i <= x; i++) {
                if (x % i == 0)
                    prime = false;
            }

            return prime;
        }

        var largeNumber = 600851475143;
        var primeDivisor = 2;

        // divide by smallest divisible prime until the smallest divisble prime is itself
        while (largeNumber != primeDivisor) {
            if (largeNumber % primeDivisor == 0) {
                largeNumber = largeNumber / primeDivisor;
                primeDivisor = 2;
            }
            else {
                primeDivisor++;
                while (!isPrime(primeDivisor)) {
                    primeDivisor++;
                }
            }
        }

        $scope.result = largeNumber;
        $scope.time = new Date().getTime() - start;
        $scope.showAnswer = true;
    };
}]);
