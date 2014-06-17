/**
 * Each services for the Blender application
 */
var br = angular.module('blenderRoute', ['blenderController', 'ngRoute']);

// Routing
br.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/connection', { templateUrl: 'view/connection.html', controller: 'connectionController' })
		.when('/home', { templateUrl: 'view/home.html', controller: 'homeController' })
		.when('/create', { templateUrl: 'view/create.html', controller: 'createController' })
		.when('/setting', { templateUrl: 'view/setting.html', controller: 'settingController' })
		.otherwise({ redirectTo: '/connection' });
}]);
