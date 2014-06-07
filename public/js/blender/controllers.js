/**
 *
 */
var bc = angular.module('blenderController', []);

var communityUri = 'http://localhost:9999',
    communityUser = 'test2',
    communityPwd = 'test2',
    token;

/**
* Connection
*/
bc.controller('connectionController', ['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.LoginWithOutAccount = function(){
        $location.path("/home/master");
    }
    $scope.loginWithAccount = function(){
        $location.path("/home/community");
    }

}]);

/**
* Home
*/
bc.controller('homeController', ['$scope', '$http', '$routeParams', 'Blender', 'Community',
    function($scope, $http, $routeParams, Blender, Community){

    switch($routeParams.action){
        // Display local recipes
        case 'master':

            $scope.recipeCommunity = false;
            $scope.recipeMaster = true;
            Blender.Recipes.getAll()
                .success(function(data) {
                    $scope.recipes = data;
                })
                .error(function(data) {
                    console.log('Error :' + data);
                });

        break;
        // Display community recipes
        case 'community':

            $scope.recipeCommunity = true;
            $scope.recipeMaster = false;
            Community.Recipes.getAll()
                .success(function(){
                    $scope.recipe = data;
                })
                .error(function(data){
                    console.log('Error :' +  data);
                })

        break;
    }  

}]);

// Recipe Controller to manage interactions between the view and the service
bc.controller('recipeController', ['$scope', '$http','Blender', 'Community',
    function ($scope, $http, $routeParams, Blender, Community){
    
    $scope.recipeList = true;

    // Open Panel for the recipe details
    $scope.openRecipe = function(recipe){
        $scope.cocktailRecipe = recipe;
        console.log(recipe);
        $scope.recipeList = false;
    };

    $scope.blend = function(recipe) {
        Blender.Recipes.execute(recipe)
            .success(function(data) {
               console.log(data);
            });
    };

    // Close Panel for the recipe details
    $scope.BackListRecipe = function(){
        $scope.recipeList = true;
    };

}]);

// Admin Controller to manage interactions between the view and the service
bc.controller('adminController', ['$scope', '$http', 'Modules', function ($scope, $http, Modules){

}]);
