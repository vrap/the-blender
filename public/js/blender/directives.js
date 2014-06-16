/**
 * Each services for the Blender application
 */
angular.module('blenderDirective', [])


/**
 * Directive to display Tints n view
 * @return {void}
 */
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
			scope.$watch('score', function(newValue, oldValue) {
               	scope.tints = [];
				if(scope.score > 0){
					for (var i = 0; i < newValue; i++) {
						scope.tints[i] = i;
					};
				}
            });
		}
    };
  })

/**
 * Directive to display Tints n view
 * @return {void}
 */
.directive('vrapIngredientName', ['ApiService', function(ApiService) {
	var template = '{{ingredientName}}';

	/**
   	* Get all ingredients
    */
    var IngredientResources = ApiService.ingredients();
	var ingredients;
    // Get all recipes
  	IngredientResources
        .query()
        .$promise
        .then(
            function(result) {
                ingredients = result;
            },
            function(result){
                console.log('Error : ' + result);
            }
        );

    return {
		scope: {
			uuid: '=uuid'
		},
		transclude: true,
		template: template,
		link: function(scope, element, attrs) {
			for(var key in ingredients){
				if(ingredients[key].uuid == scope.uuid){
					scope.ingredientName = ingredients[key].name; 
				}
			}
			if(!scope.ingredientName){
				scope.ingredientName = 'Uuid of ingredient not found in this Master';
			}
		}
    };
  }]);