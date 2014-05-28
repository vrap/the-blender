/**
 * Each services for the Blender application
 */
var bs = angular.module('blenderService', []);

// Service for recipes management
bs.factory('Recipes', ['$http', function($http) {
	return {
		get: function() {
			// Some code to get the recipes
		},
		create: function() {
			// Some code to create a recipe
		},
		save: function() {
			// Some code to save a recipe in The Blender
		},
		delete: function() {
			// Some code to delete a recipe
		}
	}
}]);

// Service for modules management
bs.factory('Modules', function() {
	return {

	}
});