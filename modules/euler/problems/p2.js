angular.module('eulerP2', [])
.controller('eulerP2Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {

    $scope.showAnswer = false;

    $scope.calculate = function () {
        var start = new Date().getTime();
        var sum = 0;

        var prev = 1;
        var current = 1;

        while (current < 4000000) {

            if (current % 2 == 0)
                sum += current;

            var next = prev + current;
            prev = current;
            current = next;
        }

        $scope.time = new Date().getTime() - start;
        $scope.result = sum;
        $scope.showAnswer = true;
    };
}]);
