/**
 * Each services for the Blender application
 */
angular.module('blenderDirective', [])
.directive('vrapScore', function() {

	var template = '<i ng-repeat="tint in tints" class="glyphicon glyphicon-tint margin-right"></i>';

    return {
		scope: {
			score: '=score'
		},
		template: template,
		link: function(scope, element, attrs) {

			scope.tints = [];

			if(scope.score > 0){
				for (var i = 0; i < scope.score; i++) {
					scope.tints[i] = i;
				};
			}

			
		}
    };
  });