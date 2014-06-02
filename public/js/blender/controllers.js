/**
 *
 */
var bc = angular.module('blenderController', []);
var communityUri = 'http://localhost:9999';

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

    // Display community recipes
    Community.Recipes.getAll(communityUri)
        .success(function(data) {
            var recipes = [];
            // Formats return
            for(var i in data.data) {
                var recipe = {};
                recipe.name = data.data[i].name;
                // Search user by its uuid
                Community.Users.get(communityUri, data.data[i].author)
                    .success(function(res) {
                        recipe.author = res.data.username;
                    })
                    .error(function() {
                        recipe.author = 'Unknown';
                    });

                recipes[i] = recipe;
            }

            $scope.comRecipes = recipes;
        })
        .error(function(data) {
            console.log('Error :' + data);
        });
}]);

// Admin Controller to manage interactions between the view and the service
bc.controller('adminController', ['$scope', '$http', 'Modules', function ($scope, $http, Modules){

}]);
