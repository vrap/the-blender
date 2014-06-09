/**
 * Each services for the Blender application
 */
angular.module('blenderModel', [])

/**
* Class User
*/
.factory('UserModel', ['$http', function ($http) {
 
    /**
    * Constructor, with class name
    */
    function User() {
        this.userName;
        this.email;
        this.community;
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
    * @return {string} url Community
    */
    User.prototype.getCommunity = function () {
        return this.community;
    };

    /**
    * Public method
    * @param {string} username
    * @return {void}
    */
    User.prototype.SetUserName = function (userName) {

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
    * @param {string} url Community
    */
    User.prototype.setCommunity = function (community) {

    	// Delete '/' of uri if exxiste
    	if(community.slice(-1) === '/'){
    		community = community.substring(0, community.length - 1);
    	}

        this.community = community;

    };

    /**
    * public method
    * @param {string} password
    */
    User.prototype.auth = function(password){
		return $http.post(
			this.getCommunity() + '/login',
			'username=' + this.getUserName() + '&password=' + password, 
			{
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
		);
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