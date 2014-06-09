/**
 * Each services for the Blender application
 */
angular.module('blenderService', [])

/**
* Service for Session Html5 storage
*/
.factory('Session', ['User', function(User){
    return {

        /**
        * User Session
        */
        Users : {

            /*
            * Set User to session storage
            * -> strigify objet and save it with key 'user'
            * @param {user} user
            */
            set: function(user){
                sessionStorage.setItem('user', JSON.stringify(user));
            },
            /*
            * get User to session storage
            * -> get key 'user' and JsonParse the string
            * -> create a new user
            * @return {user} user
            */
            get: function(){

                var SessionUser = JSON.parse(sessionStorage.getItem('user'));
                user = User.build();
                // Voir avec l'ami romain pour fair un truc plus propre :)
                if(SessionUser.userName){
                    user.SetUserName(SessionUser.userName);
                }
                if(SessionUser.email){
                    user.SetEmail(SessionUser.email);
                }
                 if(SessionUser.community){
                    user.setCommunity(SessionUser.community);
                }

                return user;

            },
        }
       
    }
}])

.factory('Recipes', ['$resource', function($resource){
    return {
        api: function(communityUri){
            return $resource(
                communityUri + '/recipes/:uuid',
                {uuid:'@id'},
                {
                    query: {
                        isArray: false,
                        method: 'GET'
                    }
                });
            }
        }
}])

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
.factory('Community', ['$http', '$cookies', function($http, $cookies, $resource) {
    return {
        Recipes: {
            getAll: function(communityUri) {
                return $http.get(
                    communityUri + '/recipes',
                    {},
                    {
                        headers: {
                            'Cookie' : $cookies.token
                        }
                    }
                    );
            },
            get: function(communityUri, token, uuid) {
                return $http.get(communityUri + '/recipes/' + uuid);
            }
        },
        User: {
            connect: function(user, password) {
                return $http.post(
                    user.getCommunity() + '/login',
                    'username=' + user.getUserName() + '&password=' + password, 
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                );
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