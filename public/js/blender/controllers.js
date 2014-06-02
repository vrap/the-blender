/**
 *
 */
var bc = angular.module('blenderController', []);

// Recipe Controller to manage interactions between the view and the service
bc.controller('recipeController', ['$scope', '$http', 'Recipes', 'Community', function ($scope, $http, Recipes, Community){
	Recipes.getAll()
			.success(function(data) {
				$scope.recipes = data;
			})
			.error(function(data) {
				console.log('Error :' + data);
			});

    Community.Recipes.getAll('http://localhost:9999')
        .success(function(data) {
            $scope.comRecipes = data.data;
        })
        .error(function(data) {
            console.log('Error :' + data);
        });
}]);

// Admin Controller to manage interactions between the view and the service
bc.controller('adminController', ['$scope', '$http', 'Modules', function ($scope, $http, Modules){

}]);
