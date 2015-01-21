angular.module('experience', [])
.controller('experienceCtrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {
    document.title = "Experience";
    $scope.selectedTab = 0;
}]);