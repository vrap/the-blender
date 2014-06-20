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

                // Display form to connect
                if(!user.isAuth()){
                    $rootScope.reload = true;
                    $rootScope.connectionCommunity = true;
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
    '$route',
    'UserModel',
    'SessionService',
    'NavService',
    function($scope, $http, $location, $rootScope, $route, UserModel, SessionService, NavService){

        NavService.hide();

        $scope.cancel = function(){
            $rootScope.connectionCommunity = false;
        }

        /*
        * Login with account
        * @param {bool} Angular validation
        * @param {string} Path where the good connection go
        */
        $scope.login = function(isValid, reload){

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
                            $rootScope.api = 'community';

                            if(reload){
                                $route.reload();
                                $rootScope.connectionCommunity = false;
                            }else{
                                $rootScope.connectionCommunity = false;
                            }

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
    'UserModel',
    function($scope, $rootScope, $http, $routeParams, $cookies, SessionService, ApiService, NavService, RecipeModel, UserModel){

        NavService.show();
        NavService.active('home');
        NavService.setPageTitle('Drink a cocktail');
        $rootScope.loadCocktailNoValid = false;

        var user = SessionService.Users.get();

        if(!user){
            console.log('lala');
            var user = UserModel.build();
            SessionService.Users.set(user);
            $rootScope.api = 'master'
        }

        var server = SessionService.Server.getCurrent();
         // first connect
        if(!server){
            console.log(server);
            SessionService.Server.setCurrent('master');
            server = 'master';
        }

        // Set Resource for recipes.
        var RecipesResources = ApiService.recipes(user.getCommunity(server));

        // Get all recipes
        RecipesResources
            .query()
            .$promise
            .then(
                function(result) {
                    $scope.recipes = result.data;
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

            $rootScope.saveOnValid = false;
            $rootScope.saveOnNoValid = false;

            ApiService.blendIt(user.getCommunity('master').uri, recipe).then(function(result){
                console.log(result.status);
                if(result.status == true){
                    $scope.loadCocktail = true;
                }else{
                    $rootScope.loadCocktailNoValid = true;
                    $scope.loadCocktailErrorMessage = "Houtch !The blender is in trouble."
                }
            })
        };

        /**
         * Ui function
         * @param  {json} recipe
         * @param  {string} type of community server
         * @return {void}
         */
        $scope.saveOn = function(recipe, server){

            $rootScope.saveOnValid = false;
            $rootScope.saveOnNoValid = false;
            $rootScope.loadCocktailNoValid = false;

            var community = user.getCommunity(server)

            if(!community){
                $rootScope.connectionCommunity = true;
                $rootScope.reload = false;
                return;
            }

             // Set Resource for recipes.
            var RecipeResources = ApiService.recipes(user.getCommunity(server));
            RecipeResources.save('data=' + JSON.stringify(recipe))
                    .$promise
                    .then(
                        function(result) {

                            if(result.status){
                                $rootScope.saveOnValid = true;
                                $scope.successMessage = result.data.msg + ' on the ' + server;
                            }else{
                                $rootScope.saveOnNoValid = true;
                                $scope.errorMessage = result.data.msg + ' on the ' + server;;
                            }
                        },
                        function(result){
                            $rootScope.saveOnNoValid = true;
                            $scope.errorMessage = 'Connection to server fail';
                        }
                    );

        };

         $scope.recipeList = true;

         $scope.backCocktail = function(){
            $scope.loadCocktail = false;
         }

        /**
        * Ui function
        * Open panel to show detail of recipe
        */
        $scope.openRecipe = function(recipe){
            $rootScope.saveOnValid = false;
            $rootScope.saveOnNoValid = false;
            $rootScope.valid = false;
            $rootScope.noValid = false;
            $scope.cocktailRecipe = recipe;
            $scope.recipeList = false;
        };

        /**
        * Ui function
        * Close panel to show detail of recipe
        */
        $scope.BackListRecipe = function(){
            $rootScope.saveOnValid = false;
            $rootScope.saveOnNoValid = false;
            $rootScope.loadCocktailNoValid = false;
            $scope.loadCocktailErrorMessage = false
            $scope.recipeList = true;
        };


}])

/**
* Recipe Controller
*/
.controller('recipeController', [
    '$scope',
    '$http',
    '$rootScope',
    'SessionService',
    function ($scope, $http, $routeParams, $rootScope, SessionService){
    
   

    

    
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
    '$rootScope',
    'NavService',
    'ApiService',
    'RecipeModel',
    'SessionService',
    function($scope, $route, $rootScope, NavService, ApiService, RecipeModel, SessionService){

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

            $rootScope.saveOnValid = false;
            $rootScope.saveOnNoValid = false;
            $rootScope.loadCocktailNoValid = false;
            $scope.loadCocktail = false;

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
                    
                ApiService.blendIt(user.getCommunity('master').uri, recipe).then(function(result){
                    console.log(result.status);
                    if(result.status == true){
                        $scope.loadCocktail = true;
                    }else{
                        $rootScope.loadCocktailNoValid = true;
                        $scope.loadCocktailErrorMessage = "Houtch !The blender is in trouble."
                    }
                })

            }


        }

        /**
         * Save cocktail
         * @return {void}
         */
        $scope.saveCocktail = function(ingredients){

            $rootScope.saveOnValid = false;
            $rootScope.saveOnNoValid = false;

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
                RecipeResources.save('data=' + recipe.formatToSend())
                    .$promise
                    .then(
                        function(result) {

                            if(result.status){
                                $scope.valid = true;
                                $scope.created = true;
                                $scope.successMessage = result.data.msg;
                            }else{
                                $scope.noValid = true;
                                $scope.errorMessage = result.data.msg;
                            }

                        },
                        function(result){
                            $scope.noValid = true;
                            $scope.errorMessage = 'Connection to server fail';
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
                $scope.nbModules = modules.length;
            },
            function(result){
                console.log('Error : ' + result);
            }
        );

    /**
     * Get all ingredients
     */
    var IngredientResources = ApiService.ingredients();
    IngredientResources
        .query()
        .$promise
        .then(
        function(result) {
            // Add parameters for each recipes
            var ing = [];
            for(var key in result){
                if(undefined !== result[key]._id) {
                    ing.push(result[key]);
                }
            }
            $scope.ingredients = ing;
        },
        function(result){
            console.log('Error : ' + result);
        }
    );

    $scope.manage = function(){
        $scope.manageBlender = true;
    }


}])

.controller('manageBlenderController', ['$scope', 'NavService', 'SessionService', 'ApiService', function($scope, NavService, SessionService, ApiService){

    $scope.addNewModule = function(isValid){

        if(isValid){
            var t = $scope.blender.pin.split(','),
                address = [];

            for(var i in t) {
                address.push(parseInt(t[i]));
            }

            var m = {
                order: $scope.nbModules + 1,
                type: $scope.blender.action,
                content: $scope.blender.ingredient,
                components: [{
                    class: "valve",
                    address: address
                }]
            };

            ApiService.addModule(m)
                .then(function(result) {
                        if(true === result.status) {
                            m.pins = $scope.blender.pin;
                            $scope.modules.push(m);
                            $scope.valid = true;
                            $scope.validMessage = 'Module added !';
                        }
                    },
                    function(result){
                        console.log('Error : ' + result);
                    }
                )
        }else{

            $scope.noValid = true;
            $scope.errorMessage = 'The form is incomplete';

        }



    }

}])
