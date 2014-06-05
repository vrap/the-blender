/**
 * Each services for the Blender application
 */
var br = angular.module('blenderRoute', ['blenderController', 'ngRoute']);

// Routing
br.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/connection', { templateUrl: 'view/connection.html', controller: 'connectionController' })
		.when('/home', { templateUrl: 'view/home.html', controller: 'homeController' })
		.otherwise({ redirectTo: '/connection' });
}]);