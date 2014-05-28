/**
 * Angular application to the front end part of The Blender app
 */

// Configuration
var app = angular.module('the-blender', []);

/**
 * Controllers
 */
app.controller('mainController', ['$scope', '$http', function ($scope, $http){
	$http.get('/api/blender/recipes')
			.success(function(data) {
				console.log(data);
			})
			.error(function(data) {
				console.log('Error ' + data);
			})
}]);
