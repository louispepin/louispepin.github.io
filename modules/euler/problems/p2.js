angular.module('eulerP2', [])
    .controller('eulerP2Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {
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

        $scope.result = sum;
        $scope.showAnswer = false;
        $scope.toggleAnswer = function () {
            $scope.showAnswer = !$scope.showAnswer;
        }
    }]);
