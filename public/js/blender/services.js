/**
 * Each services for the Blender application
 */
var bs = angular.module('blenderService', []);

// Service for blender management
bs.factory('Blender', ['$http', function($http) {
	return {
        Recipes: {
            getAll: function() {
                // Some code to get the recipes
                return $http.get('/api/blender/recipes');
            },
            get: function(uuid) {
                // Some code to get the recipes
                return $http.get('/api/blender/recipes/' + uuid);
            },
            create: function() {
                // Some code to create a recipe
            },
            save: function(uuid) {
                // Some code to save a recipe in The Blender
                return $http.post('/api/blender/recipes/' + uuid);
            },
            delete: function(uuid) {
                // Some code to delete a recipe
                return $http.delete('/api/blender/recipes/' + uuid);
            }
	    },
        Modules: {

        }
    }
}]);

// Service for community management
bs.factory('Community', ['$http', function($http) {
    return {
        Recipes: {
            getAll: function(communityUri) {
                return $http.get(communityUri + '/recipes');
            },
            get: function(communityUri, uuid) {
                return $http.get(communityUri + '/recipes/' + uuid);
            }
        },
        Users: {
            getAll: function(communityUri) {
                return $http.get(communityUri + '/users');
            },
            get: function(communityUri, uuid) {
                return $http.get(communityUri + '/users/' + uuid);
            }
        }
    }
}]);