/**
 * Each services for the Blender application
 */
angular.module('blenderService', [])

.factory('NavService', ['$rootScope', function($rootScope){

    $rootScope.nav = {
        home: false,
        create: false,
        setting: false
    };

    return{
        active: function(page){
            for(var i in $rootScope.nav){
                if(i === page){
                    $rootScope.nav[i] = true;
                }else{
                    $rootScope.nav[i] = false;
                }
            };
            $rootScope.pageTitle = page;
        },
        hide: function(){
            $rootScope.showNav = false;
        },
        show: function(){
            $rootScope.showNav = true
        },
        setPageTitle: function(title){
            $rootScope.pageTitle = title;
        },
        setNavCommunityItemTo : function(value, inverse){
            $rootScope.server = value;
            $rootScope.serverInverse = inverse
        }
    }

}])
/**
* Service for Session Html5 storage
*/
.factory('SessionService', ['UserModel', 'NavService', function(UserModel, NavService){
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
                if(SessionUser.uuid){
                    user.setUuid(SessionUser.uuid);
                }
                if(SessionUser.userName){
                    user.setUserName(SessionUser.userName);
                }
                if(SessionUser.email){
                    user.setEmail(SessionUser.email);
                }
                if(SessionUser.community){
                    user.setCommunitys(SessionUser.community);
                }

                return user;

            },
        },
        Server : {
            setCurrent: function(server){
                sessionStorage.setItem('server/current', server);

            },
            getCurrent: function(){
                server = sessionStorage.getItem('server/current');
                if(server == 'master'){
                    NavService.setNavCommunityItemTo('community', 'master');
                }else{
                    NavService.setNavCommunityItemTo('master', 'community');
                }
                return server;
            }
        }
       
    }
}])

/**
* Service for Resourse to call api
*/
.factory('ApiService', [
    '$resource',
    '$http',
    '$q',
    function($resource, $http, $q){
        return {
            recipes: function(server){

                // var isArray = false;
                // if(server.name == 'master'){
                //     isArray = true;
                // }

                return $resource(
                    server.uri + '/recipes/:uuid',
                    {uuid:'@id'},
                    {
                        query: {
                            isArray: false,
                            method: 'GET'
                        },
                        save: {
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                            method: 'POST'
                        }
                    });
            },
            ingredients: function(){
                return $resource(
                    '/api/blender/ingredients/:uuid',
                    {uuid:'@id'}
                    );
            }
        }
    }
])


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

