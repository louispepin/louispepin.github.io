angular.module('eulerP4', [])
.controller('eulerP4Ctrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {

    $scope.showAnswer = false;

    $scope.calculate = function () {
        var start = new Date().getTime();

        var isPalindrome = function (num) {
            var string = num.toString();
            for (var i = 0; i < string.length/2; i++) {
                if (string[i] != string[string.length - i - 1])
                    return false;
            }

            return true;
        }

        var currentLargest = 0;
        for (var i = 999; i > 100; i--) {
            for (var j = 999; j > 100; j--) {
                var product = i * j;
                if (product < currentLargest)
                    break;

                if (isPalindrome(product) && product > currentLargest)
                    currentLargest = product;
            }
        }

        $scope.result = currentLargest;
        $scope.time = new Date().getTime() - start;
        $scope.showAnswer = true;
    };
}]);
