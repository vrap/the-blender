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
		get: function(ruid) {
			// Some code to get the recipes
			return $http.get('/api/blender/recipes/' + ruid);
		},
		create: function() {
			// Some code to create a recipe
		},
		save: function(ruid) {
			// Some code to save a recipe in The Blender
			return $http.post('/api/blender/recipes/' + ruid);
		},
		delete: function(ruid) {
			// Some code to delete a recipe
			return $http.delete('/api/blender/recipes/' + ruid);
		},
        getAllFromCommunity: function(communityUri) {
            return $http.get(communityUri + '/recipes');
        },
        getFromCommunity: function(communityUri, ruid) {
            return $http.get(communityUri + '/recipes/' + ruid);
        }
	}
}]);

// Service for modules management
bs.factory('Modules', function() {
	return {

	}
});