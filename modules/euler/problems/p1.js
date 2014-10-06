angular.module('eulerP1', [])
.controller('eulerP1Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {
    var sum = 0;
    for (var i = 1; i < 1000; i++)
    {
        if (i % 3 == 0 || i % 5 == 0)
        {
            sum += i;
        }
    }

    $scope.result = sum;
    $scope.showAnswer = false;
    $scope.toggleAnswer = function () {
        $scope.showAnswer = !$scope.showAnswer;
    }
}]);
