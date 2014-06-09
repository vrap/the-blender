/**
 * Each services for the Blender application
 */
angular.module('blenderService', [])

/**
* Service for Session Html5 storage
*/
.factory('SessionService', ['UserModel', function(UserModel){
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
                user = UserModel.build();
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

/**
* Service for Resourse to call api
*/
.factory('RecipeService', ['$resource', function($resource){
    return {
        /**
        * Recipe Api
        */
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

/**
* Service for user
*/
.factory('UserService', ['$http', function($http){

    return{
        api : {
            getAll: function(communityUri, token) {
                return $http.get(communityUri + '/users');
            },
            get: function(communityUri, token, uuid) {
                return $http.get(communityUri + '/users/' + uuid);
            }
        }
    }

}])

