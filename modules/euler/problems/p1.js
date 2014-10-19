angular.module('eulerP1', [])
.controller('eulerP1Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {

    $scope.showAnswer = false;

    $scope.calculate = function() {
        var start = new Date().getTime();
        var sum = 0;
        for (var i = 1; i < 1000; i++)
        {
            if (i % 3 == 0 || i % 5 == 0)
            {
                sum += i;
            }
        }

        $scope.time = new Date().getTime() - start;
        $scope.result = sum;
        $scope.showAnswer = true;
    };
}]);
