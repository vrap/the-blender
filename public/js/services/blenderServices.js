/**
 * Each services for the Blender application
 */
var bs = angular.module('blenderService', []);

// Service for recipes management
bs.factory('Recipes', ['$http', function($http) {
	return {
		getAll: function() {
			// Some code to get the recipes
			return $http.get('/api/blender/recipes');
		},
		get: function(uid) {
			// Some code to get the recipes
			return $http.get('/api/blender/recipes/' + uid);
		},
		create: function() {
			// Some code to create a recipe
		},
		save: function() {
			// Some code to save a recipe in The Blender
			return $http.post('/api/blender/recipes/' + uid);
		},
		delete: function() {
			// Some code to delete a recipe
			return $http.delete('/api/blender/recipes/' + uid);
		}
	}
}]);

// Service for modules management
bs.factory('Modules', function() {
	return {

	}
});