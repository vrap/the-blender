/**
 * Each services for the Blender application
 */
angular.module('blenderService', [])
.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])

// Service for blender management
.factory('Blender', ['$http', function($http) {
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
            execute: function(recipe) {
                // Some code to create a recipe
                return $http.post('/api/blender/execute', recipe);
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
}])

// Service for community management
.factory('Community', ['$http', function($http) {
    return {
        Recipes: {
            getAll: function(communityUri, token) {
                return $http.get(communityUri + '/recipes');
            },
            get: function(communityUri, token, uuid) {
                return $http.get(communityUri + '/recipes/' + uuid);
            }
        },
        User: {
            connect: function(user, password) {
                return $http({
                    method: 'POST',
                    url: user.getCommunity() + '/login',
                    data: 
                        {
                            username : user.getUserName(),
                            password : password
                        }, 
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },
            getAll: function(communityUri, token) {
                return $http.get(communityUri + '/users');
            },
            get: function(communityUri, token, uuid) {
                return $http.get(communityUri + '/users/' + uuid);
            }
        }
    }
}]);