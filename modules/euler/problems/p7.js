angular.module('eulerP7', [])
.controller('eulerP7Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {

    $scope.showAnswer = false;

    $scope.calculate = function () {
        var start = new Date().getTime();

        var count = 1;
        var num = 2;
        var primes = [2];

        // taken from problem 3
        var isPrime = function (x) {
            var prime = true;
            for (var i = 2; i * i <= x; i++) {
                if (x % i == 0)
                    prime = false;
            }

            return prime;
        };

        // brute force with a few skips
        while (count < 10001) {
            num++;

            if (num % 2 == 0)
                continue;

            if (isPrime(num)) {
                count++;
                primes.push(num);
            }
        }

        $scope.result = num;
        $scope.time = new Date().getTime() - start;
        $scope.showAnswer = true;
    };
}]);
