/**
 * Each services for the Blender application
 */
angular.module('blenderModelUser', [])

/**
* Class User
*/
.factory('UserModel', ['$http', function ($http) {
 
    /**
    * Constructor, with class name
    */
    function User() {
        this.uuid;
        this.userName;
        this.email;
        this.community = 
            [{ 
                name : 'master' ,
                uri : '/api/blender' 
            }];
    }

    /**
    * Public method
    * @return {int} uuid
    */
    User.prototype.getUuid = function(){
        return this.uuid;
    }

    /**
    * Public method
    * @return {string} username
    */
    User.prototype.getUserName = function () {
        return this.userName;
    };

    /**
    * Public method
    * @return {string} email
    */
    User.prototype.getEmail = function () {
        return this.email;
    };

    /**
    * Public method
    * @return {string} type of server
    */
    User.prototype.getCommunity = function (server) {

        for(var key in this.community){
            if(this.community[key].name == server){
                return this.community[key];
            }
        }
        return null;
    };

    /**
    * Public method
    * @param {int} uuid
    * @return {void}
    */
    User.prototype.setUuid = function(uuid){
        this.uuid = uuid;
    }

    /**
    * Public method
    * @param {string} username
    * @return {void}
    */
    User.prototype.setUserName = function (userName) {
        this.userName = userName;
    };

    /**
    * Public method
    * @param {string} email
    * @return {void}
    */
    User.prototype.setEmail = function (email) {
        this.email = email;
    };

    /**
    * Public method
    * @param {string} server (master/community)
    * @param {string} url Community
    */
    User.prototype.setCommunity = function (server, community) {
    	// Delete '/' of uri if exxiste
    	if(community.slice(-1) === '/'){
    		community = community.substring(0, community.length - 1);
    	}
        this.community.push({name : server, uri: community});
    };

    /**
    * Public method
    * @param {json}
    */
    User.prototype.setCommunitys = function(community){
        this.community = community;
    };

    /**
    * public method
    * @param {string} password
    */
    User.prototype.auth = function(password){
		return $http.post(
			this.getCommunity('community').uri + '/login',
			'username=' + this.getUserName() + '&password=' + password, 
			{
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
    }

    User.prototype.isAuth = function(){

        if(this.getCommunity('community')){
            return true;
        }
        return false;

    }


    /**
    * Static method
    * Create new user
    * @return {User} (empty)
    */
    User.build = function(data) {
        return new User();
    };
    
    /**
    * Return the constructor function
    */
    return User;

}])