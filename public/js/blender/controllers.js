/**
 * Controllers of the application
 */
angular.module('blenderController', [])

/**
 * NavController
 * Manage bottom bar
 */
.controller('navController', [
    '$scope',
    '$route',
    '$location',
    '$rootScope',
    'SessionService',
    function($scope, $route, $location, $rootScope, SessionService){

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
* ConnectionController
 * Manage connection to the community
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
        /**
         * Cancel connection
         */
        $scope.cancel = function(){
            $rootScope.connectionCommunity = false;
        };

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
                            $scope.errorMessage = 'User Name or Password are invalid';
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
* HomeController
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

        var user = SessionService.Users.get();

        if(!user){
            user = UserModel.build();
            SessionService.Users.set(user);
            $rootScope.api = 'master'
        }

        var server = SessionService.Server.getCurrent();
         // first connect
        if(!server){
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
            ApiService.blendIt(user.getCommunity('master').uri, recipe).then(function(result){
                console.log(result.status);
                if(result.status == true){
                    $scope.loadCocktail = true;
                }else{
                    NavService.setErrorMessage("Houtch !The blender is in trouble.");
                }
            })
        };

        /**
         * Ui function
         * @param  {json} recipe
         * @param  {string} server type of community server
         * @return {void}
         */
        $scope.saveOn = function(recipe, server){

            var community = user.getCommunity(server);

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
                                NavService.setSuccessMessage(result.data.msg);
                            }else{
                                NavService.setErrorMessage(result.data.msg);
                            }
                        },
                        function(result){
                            NavService.setErrorMessage('Connection to server fail');
                        }
                    );

        };

         $scope.recipeList = true;
        /**
         * Ui function
         * Back to cocktail list
         */
         $scope.backCocktail = function(){
            $scope.loadCocktail = false;
         };

        /**
        * Ui function
        * Open panel to show detail of recipe
        */
        $scope.openRecipe = function(recipe){
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
    '$route',
    'SessionService',
    'ApiService',
    'NavService',
    'RecipeModel',
    function ($scope, $http, $rootScope, $route, SessionService, ApiService, NavService, RecipeModel){

        /**
         * Ui function
         * Display or hide form for editing a recipe
         * @param {Recipe} cocktailRecipe
         */
        $scope.toggleEditRecipe = function(cocktailRecipe) {
            if ($scope.editMode == true) {
                NavService.setPageTitle('Drink a cocktail');
                $scope.editMode = false;
            } else {
                NavService.setPageTitle('Edit your cocktail');
                $scope.editMode = true;

                var steps = [];
                for(var i in cocktailRecipe.steps) {
                    for(j in cocktailRecipe.steps[i].parameters) {
                        if('dosage' == cocktailRecipe.steps[i].parameters[j].name) {
                            var dose = cocktailRecipe.steps[i].parameters[j].value;
                        }
                        if('ingredient' == cocktailRecipe.steps[i].parameters[j].name) {
                            var ing = cocktailRecipe.steps[i].parameters[j].value;
                        }
                    }
                    steps[ing] = dose;
                }

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
                        for(var key in result){
                            (steps[result[key].uuid]) ? result[key].parameters = steps[result[key].uuid] : result[key].parameters = 0;
                        }
                        $scope.ingredients = result;
                    },
                    function(result){
                        console.log('Error : ' + result);
                    }
                );
            }
        };

        /**
         * Fork a recipe in the database
         * @param {Recipe} cocktailRecipe
         */
        $scope.fork = function(cocktailRecipe){
            var user = SessionService.Users.get();
            // fork recipe cocktail
            var recipe = RecipeModel.build();
            recipe.setName(cocktailRecipe.name);
            recipe.setAuthor(user);
            recipe.setForked(cocktailRecipe.uuid);

            for(key in cocktailRecipe.steps){
                var temp = {
                    order: cocktailRecipe.steps[key].order,
                    action: cocktailRecipe.steps[key].action
                };

                for(i in cocktailRecipe.steps[key].parameters) {
                    if('ingredient' == cocktailRecipe.steps[key].parameters[i].name) {
                        temp.value = {
                            uuid: cocktailRecipe.steps[key].parameters[i].value
                        };
                    }
                    if('dosage' == cocktailRecipe.steps[key].parameters[i].name) {
                        temp.value.parameters = cocktailRecipe.steps[key].parameters[i].value;
                    }
                }
                recipe.pushStep(temp.order, temp.action, temp.value);
            }

            var RecipeResources = ApiService.recipes(user.getCommunity(server));
            RecipeResources.save('data=' + recipe.formatToSend())
                .$promise
                .then(
                function(result) {
                    if(result.status){
                        console.log($rootScope.pageTitle);
                        $scope.recipes.push(recipe);
                        NavService.setSuccessMessage(result.data.msg);
                    }else{
                        NavService.setErrorMessage(result.data.msg);
                    }
                },
                function(result){
                    NavService.setErrorMessage('Connection to server fail');
                }
            );
        };

        /**
         * Save recipe modifications
         * @param {Recipe} cocktailRecipe
         */
        $scope.update = function(cocktailRecipe) {
            var user = SessionService.Users.get();
            var recipe = RecipeModel.build();

            recipe.setUuid(cocktailRecipe.uuid);
            recipe.setName(cocktailRecipe.name);
            recipe.setAuthor(user);
            recipe.setUpdated(new Date());
            recipe.setForked(cocktailRecipe.forked);
            var order = 1;
            for(key in $scope.ingredients){
                if($scope.ingredients[key].parameters > 0){
                    recipe.pushStep(order, 'pour', $scope.ingredients[key]);
                    order++;
                }
            }

            var RecipeResources = ApiService.recipes(user.getCommunity(server));
            RecipeResources
                .update('data=' + recipe.formatToSend())
                .$promise
                .then(
                function(result) {
                    if(result.status){
                        cocktailRecipe.steps = JSON.parse(recipe.formatToSend()).steps;
                        NavService.setSuccessMessage(result.data.msg);
                        NavService.setPageTitle('Drink a cocktail');
                        $scope.editMode = false;
                    }else{
                        NavService.setErrorMessage(result.data.msg);
                    }
                },
                function(result){
                    NavService.setErrorMessage('Connection to server fail');
                }
            );
        };

        /**
         * Delete recipe in database
         * @param {Recipe} cocktailRecipe
         */
        $scope.deleteRecipe = function(cocktailRecipe) {
            var user = SessionService.Users.get();

            ApiService.removeRecipe(user.getCommunity('master').uri, cocktailRecipe)
                .then(function(result){
                    if(result.status){
                        NavService.setSuccessMessage(result.data.msg);
                        $route.reload();
                    }else{
                        NavService.setErrorMessage(result.data.msg);
                    }
                },
                function(result){
                    NavService.setErrorMessage('Connection to server fail!');
                }
            );
        };

        /**
         * UI function add ingredients to the recipe
         * @param  {object} ingredient
         * @return {void}
         */
        $scope.chooseIngredient = function(ingredient){
            ingredient.parameters = ingredient.parameters + 1;
        };

        /**
         * UI function remove ingredients to the recipe
         * @param  {object} ingredient
         * @return {void}
         */
        $scope.removeIngredient = function(ingredient){
            ingredient.parameters = ingredient.parameters - 2;
        };
}])

/**
 * Creation of cocktail controller
 * @param  {Angular service} $scope
 * @param  {Vrap service} NavService
 * @param  {Vrap service} RecipeService
 * @param  {Vrap service model} RecipeModel
 * @param  {Vrap service} SessionService
 * @return {void}
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
        };

        /**
         * UI function remove ingredients to the recipe
         * @param  {object} ingredient
         * @return {void}
         */
        $scope.removeIngredient = function(ingredient){
            ingredient.parameters = ingredient.parameters - 2;
        };

        /**
         * More Cocktail : hide pannel succes, show liste of ingredient
         * @return {void}
         */
        $scope.moreCocktail = function(){
            $route.reload();
        };

        /**
         * Ask the Blender to make the recipe
         * @param {Array} ingredients
         */
        $scope.blendIt = function(ingredients){

            $scope.loadCocktail = false;

            var user = SessionService.Users.get();
            
            // create recipe cocktail
            var recipe = RecipeModel.build();

            var name = 'No name';
            if($scope.cocktail != undefined){
                name = $scope.cocktail.name;
            }
            recipe.setName(name);
            recipe.setAuthor(user);

            var order = 0;
            for(key in ingredients){
                if(ingredients[key].parameters > 0){
                    order++;
                    recipe.pushStep(order, 'pour', ingredients[key]);
                }
            }

            if(order == 0){
                NavService.setErrorMessage('The recipe have no ingredients');
            }else{
                    
                ApiService.blendIt(user.getCommunity('master').uri, recipe).then(function(result){
                    if(result.status == true){
                        $scope.loadCocktail = true;
                    }else{
                        NavService.setErrorMessage("Houtch !The blender is in trouble.");
                    }
                })

            }
        };

        /**
         * Save cocktail
         * @param {Array} ingredients
         * @return {void}
         */
        $scope.saveCocktail = function(ingredients){
            // check name is not empty
            if($scope.cocktail === undefined){
                NavService.setErrorMessage('The name of this awesome cocktail is empty !');
            }else{

                var user = SessionService.Users.get();
                // create recipe cocktail
                var recipe = RecipeModel.build();
                recipe.setName($scope.cocktail.name);
                recipe.setAuthor(user);

                var order = 1;
                for(key in ingredients){
                    if(ingredients[key].parameters > 0){
                        recipe.pushStep(order, 'pour', ingredients[key]);
                        order++;
                    }
                }

                var RecipeResources = ApiService.recipes(user.getCommunity(server));
                RecipeResources.save('data=' + recipe.formatToSend())
                    .$promise
                    .then(
                        function(result) {

                            if(result.status){
                                $scope.created = true;
                                NavService.setSuccessMessage(result.data.msg);
                            }else{
                                NavService.setErrorMessage(result.data.msg);
                            }

                        },
                        function(result){
                            NavService.setErrorMessage('Connection to server fail');
                        }
                    );
                
            }

        }
    }
])

/**
 * SettingController
 * Manages parameters of the application
 */
.controller('settingController', [
    '$scope',
    'NavService',
    'SessionService',
    'ApiService',
    function($scope, NavService, SessionService, ApiService){

        NavService.show();
        NavService.active('setting');
        NavService.setPageTitle('Settings');
        $scope.connectedServer = SessionService.Server.getCurrent();

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
                                content: result[i].content,
                                edit: false
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
        $scope.types = [
            'pourer'
        ];

        /**
         * UI function
         * Display form to set parameters of the machine
         */
        $scope.manage = function(){
            $scope.manageBlender = true;
        }
}])

/**
 * ManageBlenderController
 * Manages Blender-specific settings
 */
.controller('manageBlenderController', [
    '$scope',
    'NavService',
    'SessionService',
    'ApiService',
    function($scope, NavService, SessionService, ApiService){
        $scope.edit = false;

        /**
         * Insert new module
         * @param {Boolean} isValid
         */
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
                                m.edit = false;
                                $scope.modules.push(m);
                                NavService.setSuccessMessage('Module added!');
                            }
                        },
                        function(result){
                            console.log('Error : ' + result);
                        }
                    )
            }else{
                NavService.setErrorMessage('The form is incomplete');
            }
        };

        /**
         * UI function
         * Display or hide form to edit a module
         * @param {Module} module
         */
        $scope.toggleEditModule = function(module) {
            (true === module.edit) ? module.edit = false : module.edit = true;
        };

        /**
         * Save modifications of the module
         * @param {Boolean} isValid
         * @param {Module} module
         */
        $scope.editModule = function(isValid, module){
            if(isValid){
                var t = module.pins.split(','),
                    address = [];

                for(var i in t) {
                    address.push(parseInt(t[i]));
                }

                var m = {
                    order: module.order,
                    type: module.type,
                    content: module.content,
                    components: [{
                        class: "valve",
                        address: address
                    }]
                };

                ApiService.editModule(m)
                    .then(function(result) {
                        if(true === result.status) {
                            module.edit = false;
                            NavService.setSuccessMessage('Module updated');
                        }
                    },
                    function(result){
                        console.log('Error : ' + result);
                    }
                )

            }else{
                 NavService.setErrorMessage('The form is incomplete');
            }
        };

        /**
         * Delete a module
         * @param {Module} module
         */
        $scope.deleteModule = function(module) {
            var t = module.pins.split(','),
                address = [];

            for(var i in t) {
                address.push(parseInt(t[i]));
            }

            var m = {
                order: module.order,
                type: module.type,
                content: module.content,
                components: [{
                    class: "valve",
                    address: address
                }]
            };

            ApiService.deleteModule(m)
                .then(function(result) {
                    if(true === result.status) {
                        m.edit = false;
                        $scope.modules.splice(m.order - 1, 1);
                        for(var i in $scope.modules) {
                            if($scope.modules[i].order > m.order) {
                                $scope.modules[i].order--;
                            }
                        }
                        NavService.setSuccessMessage('Module deleted!');
                    }
                },
                function(result){
                    console.log('Error : ' + result);
                }
            )
        };
}]);
