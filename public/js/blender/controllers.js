/**
 *
 */
var token;
angular.module('blenderController', [])

.controller('navController', [
    '$scope',
    '$route',
    '$location',
    '$rootScope',
    'SessionService',
    function($scope, $route, $location, $rootScope,SessionService){

        $scope.switchServer = function(server){

            if(server == 'community'){
                var user = SessionService.Users.get();

                if(!user.isAuth()){
                    $rootScope.backPath = $location.path();
                    $location.path('/connection/community');
                    return;
                }else{
                     SessionService.Server.setCurrent(server);
                }
            }

            SessionService.Server.setCurrent(server);
            $route.reload()
        }

    }
])
/**
* Connection
*/
.controller('connectionController', [
    '$scope',
    '$http',
    '$location',
    '$rootScope',
    'UserModel',
    'SessionService',
    'NavService',
    function($scope, $http, $location, $rootScope , UserModel, SessionService, NavService){

        NavService.hide();

        $scope.cancel = function(){
            window.history.back();
        }

        /*
        * Login without account
        * => Redirect to the route home with param "master"
        */
        $scope.LoginWithOutAccount = function(){

            // Créate new user
            var user = UserModel.build();
            // Set path for master blender api
            //user.setCommunity('master', '/api/blender');
            // Set User in session storage
            SessionService.Users.set(user);
            SessionService.Server.setCurrent('master');
            
            // Set RootScope Api variable to switch api button in view
            $rootScope.api = 'master'
            // Redirect to the home
            $location.path("/home");
            

        }

        /*
        * Login with account
        * @param {bool} Angular validation
        * @param {string} Path where the good connection go
        */
        $scope.loginWithAccount = function(isValid, path){

            $scope.noValid = false;

            if(isValid){
                
                // Créate new user
                var user = UserModel.build();
                user.setUserName($scope.user.userName);
                user.setEmail($scope.user.email);
                user.setCommunity('community', $scope.user.community);

                // Send data to community api
                user.auth($scope.user.password)
                    .success(function(response){

                        SessionService.Server.setCurrent('community');
                        if(response.status == false){
                            $scope.noValid = true;
                            $scope.errorMessage = 'User Name or Password are invalide';
                        }else{
                            user.setUuid(response.user.uuid);
                            SessionService.Users.set(user);
                            $rootScope.api = 'community'
                            $location.path(path);
                        }

                    })
                    .error(function(response){
                        console.log(response);
                        $scope.noValid = true;
                        $scope.errorMessage = 'Connection to community fail';
                        user.setCommunity('community', '');
                    });


            }else{
                $scope.noValid = true;
                $scope.errorMessage = 'The form is incomplete';
            }

            
        }

}])

/**
* Home
*/
.controller('homeController', [
    '$scope',
    '$rootScope',
    '$http',
    '$routeParams',
    '$cookies',
    'SessionService',
    'ApiService',
    'NavService',
    'RecipeModel',
    function($scope, $rootScope, $http, $routeParams, $cookies, SessionService, ApiService, NavService, RecipeModel){

        NavService.show();
        NavService.active('home');
        NavService.setPageTitle('Drink a cocktail');

        var server = SessionService.Server.getCurrent();

        var user = SessionService.Users.get();

        console.log(user.getCommunity(server));

        // Set Resource for recipes.
        var RecipesResources = ApiService.recipes(user.getCommunity(server));

        // Get all recipes
        RecipesResources
            .query()
            .$promise
            .then(
                function(result) {

                    console.log(result);
                    $scope.recipes = result.data;
                    console.log(result.data);

                },
                function(result){
                    console.log('Error : ' + result.data);
                }
            );

        /**
        * Ui function
        * Send the recipe to the master to make it !
        */
        $scope.blendIt = function(recipe) {
        

            ApiService.blendIt(user.getCommunity('master').uri, recipe).then(function(e){
                console.log(e);
            })
            

        };

}])

/**
* Recipe Controller
*/
.controller('recipeController', [
    '$scope',
    '$http',
    'SessionService',
    function ($scope, $http, $routeParams, SessionService){
    
    $scope.recipeList = true;

    /**
    * Ui function
    * Open panel to show detail of recipe
    */
    $scope.openRecipe = function(recipe){
        $scope.cocktailRecipe = recipe;
        $scope.recipeList = false;
    };

    /**
    * Ui function
    * Close panel to show detail of recipe
    */
    $scope.BackListRecipe = function(){
        $scope.recipeList = true;
    };

    

    
}])

/**
 * Creation of cocktail controller
 * @param  {Angular service} $scope
 * @param  {Vrap service} NavService
 * @param  {Vrap service} RecipeService
 * @param  {Vrap service model} RecipeModel
 * @param  {Vrap service} SessionService
 * @return {Void}
 */
.controller('createController', [
    '$scope',
    '$route',
    'NavService',
    'ApiService',
    'RecipeModel',
    'SessionService',
    function($scope, $route,NavService, ApiService, RecipeModel, SessionService){

        NavService.show();
        NavService.active('create');
        NavService.setPageTitle('Create a cocktail');

        $scope.ingredientChoose = [];
        var server = SessionService.Server.getCurrent();

        /**
         * Get all ingredients
         */
        var IngredientResources = ApiService.ingredients();

        // Get all recipes
        IngredientResources
            .query()
            .$promise
            .then(
                function(result) {
                    // Add parameters for each recipes
                    for(var key in result){
                        result[key].parameters = 0;
                    }
                    $scope.ingredients = result;
                },
                function(result){
                    console.log('Error : ' + result);
                }
            );

        /**
         * UI function add ingredients to the recipe
         * @param  {object} ingredient
         * @return {void}
         */
        $scope.chooseIngredient = function(ingredient){
            ingredient.parameters = ingredient.parameters + 1;
        }

        /**
         * UI function remove ingredients to the recipe
         * @param  {object} ingredient
         * @return {void}
         */
        $scope.removeIngredient = function(ingredient){
            ingredient.parameters = ingredient.parameters - 2;
        }

        /**
         * More Cocktail : hide pannel succes, show liste of ingredient
         * @return {void}
         */
        $scope.moreCocktail = function(ingredients){
            $route.reload();
        }

        $scope.blendIt = function(ingredients){

            var user = SessionService.Users.get();
            
            // create recipe cocktail
            var recipe = RecipeModel.build();

            var name = 'No name'
            if($scope.cocktail != undefined){
                name = $scope.cocktail.name;
            }
            recipe.setName(name)
            recipe.setAuthor(user);

            var order = 0;
            for(key in ingredients){
                if(ingredients[key].parameters > 0){
                    order++;
                    recipe.pushStep(order, 'poor', ingredients[key]);
                }
            }

            if(order == 0){
                $scope.noValid = true;
                $scope.errorMessage = 'The recipe have no ingredients';
            }else{
                
            }


        }

        /**
         * Save cocktail
         * @return {void}
         */
        $scope.saveCocktail = function(ingredients){

            $scope.noValid = false;

            // check name is not empty
            if($scope.cocktail === undefined){
                $scope.noValid = true;
                $scope.errorMessage = 'The name of this awsome cocktail is empty !';
            }else{

                var user = SessionService.Users.get();
                // create recipe cocktail
                var recipe = RecipeModel.build();
                recipe.setName($scope.cocktail.name);
                recipe.setAuthor(user);

                var order = 1;
                for(key in ingredients){
                    if(ingredients[key].parameters > 0){
                        recipe.pushStep(order, 'poor', ingredients[key]);
                        order++;
                    }
                }

                var RecipeResources = ApiService.recipes(user.getCommunity(server));
                RecipeResources.save(recipe.formatToSend())
                    .$promise
                    .then(
                        function(result) {
                            if(result.status){
                                $scope.valid = true;
                                $scope.created = true;
                                $scope.successMessage = 'Great a new cocktail saved !';
                            }
                        },
                        function(result){
                            $scope.noValid = true;
                            $scope.errorMessage = 'Connection to server fail';
                            console.log('Error : ' + result);
                        }
                    );
                
            }

        }

    }
])

/**
* Admin Controller
*/
.controller('adminController', ['$scope', '$http', 'Modules', function ($scope, $http, Modules){

}])

.controller('settingController', ['$scope', 'NavService', 'SessionService', 'ApiService', function($scope, NavService, SessionService, ApiService){

    NavService.show();
    NavService.active('setting');
    NavService.setPageTitle('Settings');
    var server = SessionService.Server.getCurrent();
    $scope.connectedServer = server;

    $scope.manageBlender = false;

    /**
     * Get all modules
     */
    var ModuleResources = ApiService.modules();

    // Get all modules
    ModuleResources
        .query()
        .$promise
        .then(
            function(result) {
                var modules = [];
                // Add parameters for each recipes

                for(var i in result) {
                    if(undefined !== result[i]._id) {
                        var pins = '';
                        for(var j in result[i].components) {
                            for(var k in result[i].components[j].address) {
                                pins += result[i].components[j].address[k] + ', ';
                            }
                        }

                        modules.push({
                            order: result[i].order,
                            pins: pins.slice(0, -2),
                            type: result[i].type,
                            content: result[i].content
                        });
                    }
                }

                $scope.modules = modules;
            },
            function(result){
                console.log('Error : ' + result);
            }
        );

    $scope.manage = function(){
        $scope.manageBlender = true;
    }


}])

.controller('manageBlenderController', ['$scope', 'NavService', 'SessionService', function($scope, NavService, SessionService){

    $scope.addNewModule = function(isValid){

        if(isValid){

        }else{

            $scope.noValid = true;
            $scope.errorMessage = 'The form is incomplete';

        }

    }

}])
