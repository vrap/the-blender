/**
 * Angular application to the front end part of The Blender app
 */

// Configuration
var app = angular.module('the-blender',
	[
		'blenderController',
		'blenderService',
		'blenderRoute',
		'blenderDirective',
		'blenderModel',
		'ngCookies'
	]);