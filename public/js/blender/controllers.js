/**
 *
 */
var bc = angular.module('blenderController', []);

var communityUri = 'http://localhost:9999',
    communityUser = 'test2',
    communityPwd = 'test2',
    token;

// Home controller
bc.controller('connectionController', ['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.LoginWithOutAccount = function(){
        $location.path("/home");
    }

}])

// Home controller
bc.controller('homeController', ['$scope', '$http', function($scope, $http){

    $scope.recipeCommunity = false;
    $scope.recipeMaster = true;

}])

// Recipe Controller to manage interactions between the view and the service
bc.controller('recipeController', ['$scope', '$http', 'Blender', 'Community', function ($scope, $http, Blender, Community){
    
    $scope.recipeList = true;

    $scope.openRecipe = function(){
        $scope.recipeList = false;
    }

    $scope.BackListRecipe = function(){
        $scope.recipeList = true;
    }


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
