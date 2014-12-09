angular.module('eulerP5', [])
.controller('eulerP5Ctrl', ['$scope', function($scope) {

    document.title = "Problem 5";
    $scope.showAnswer = false;

    $scope.calculate = function () {
        var start = new Date().getTime();

        var num = 0;
        var found = false;

        // brute force, increment by 20 to save some time
        while(!found) {
            num += 20;
            found = true;

            for (var i = 1; i <= 20; i++) {
                if (num % i != 0)
                    found = false;
            }
        }

        $scope.result = num;
        $scope.time = new Date().getTime() - start;
        $scope.showAnswer = true;
    };
}]);
