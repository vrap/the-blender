/**
 *
 */
var bc = angular.module('blenderController', []);

// Recipe Controller to manage interactions between the view and the service
bc.controller('recipeController', ['$scope', '$http', 'Recipes', 'Community', function ($scope, $http, Recipes, Community){
	// Display local recipes
    Recipes.getAll()
        .success(function(data) {
            $scope.recipes = data;
        })
        .error(function(data) {
            console.log('Error :' + data);
        });

    // Display community recipes
    Community.Recipes.getAll('http://localhost:9999')
        .success(function(data) {
            var recipes = [];
            // Formats return
            for(var i in data.data) {
                var recipe = {};
                recipe.name = data.data[i].name;
                // Search user by its uuid
                Community.Users.get('http://localhost:9999', data.data[i].author)
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
