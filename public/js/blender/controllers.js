/**
 *
 */
var bc = angular.module('blenderController', []);
var communityUri = 'http://localhost:9999',
    communityUser = 'test2',
    communityPwd = 'test2',
    token;

// Recipe Controller to manage interactions between the view and the service
bc.controller('recipeController', ['$scope', '$http', 'Blender', 'Community', function ($scope, $http, Blender, Community){
   	// Display local recipes
    Blender.Recipes.getAll()
        .success(function(data) {
            $scope.recipes = data;
        })
        .error(function(data) {
            console.log('Error :' + data);
        });





}]);

// Admin Controller to manage interactions between the view and the service
bc.controller('adminController', ['$scope', '$http', 'Modules', function ($scope, $http, Modules){

}]);
