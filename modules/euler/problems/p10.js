angular.module('eulerP10', [])
.controller('eulerP10Ctrl', ['$scope', function($scope) {

    document.title = "Problem 10";
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
        };

        // start at 3, skip even numbers
        var sum = 2;
        for (var i = 3; i < 2000000; i+=2) {
            if (isPrime(i))
                sum += i;
        }

        $scope.result = sum;
        $scope.time = new Date().getTime() - start;
        $scope.showAnswer = true;
    };
}]);
