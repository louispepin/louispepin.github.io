angular.module('eulerP3', [])
    .controller('eulerP3Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {
        var sum = 0;

        $scope.result = sum;
        $scope.showAnswer = false;
        $scope.toggleAnswer = function () {
            $scope.showAnswer = !$scope.showAnswer;
        }
    }]);
