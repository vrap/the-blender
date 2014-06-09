/**
 *
 */
var bc = angular.module('blenderController', []);
var token;

/**
* Connection
*/
bc.controller('connectionController', ['$scope', '$http', '$location', '$rootScope', 'UserModel', 'SessionService',
    function($scope, $http, $location, $rootScope , UserModel, SessionService){

    /*
    * Login without account
    * => Redirect to the route home with param "master"
    */
    $scope.LoginWithOutAccount = function(){

        // Créate new user
        var user = UserModel.build();
        // Set path for master blender api
        user.setCommunity('/api/blender');
        // Set User in session storage
        SessionService.Users.set(user);
        // Set RootScope Api variable to switch api button in view
        $rootScope.api = 'master'
        // Redirect to the home
        $location.path("/home");
        

    }

    /*
    * Login with account
    * -> check the form
    * -> get the Response of api
    * -> redirect to the route home with param "community"
    * @param {bool} Angular validation
    */
    $scope.loginWithAccount = function(isValid){

        if(isValid){
            
            // Créate new user
            var user = UserModel.build();
            user.SetUserName($scope.user.userName);
            user.setEmail($scope.user.email);
            user.setCommunity($scope.user.community);

            // Send data to community api
            user.auth($scope.user.password)
                .success(function(response){

                    if(response.status == false){
                        $scope.noValid = true;
                        $scope.errorMessage = 'User Name or Password are invalide';
                    }else{
                        SessionService.Users.set(user);
                        $rootScope.api = 'community'
                        $location.path("/home");
                    }

                })
                .error(function(response){
                    console.log(response);
                    $scope.noValid = true;
                    $scope.errorMessage = 'Connection to community fail';
                });


        }else{
            $scope.noValid = true;
            $scope.errorMessage = 'The form is incomplete';
        }

        
    }

}]);

/**
* Home
*/
bc.controller('homeController', ['$scope', '$http', '$routeParams', '$cookies', 'SessionService', 'RecipeService',
    function($scope, $http, $routeParams, $cookies, SessionService, RecipeService){

        var user = SessionService.Users.get();
        // Set Resource for recipes.
        var RecipesResources = RecipeService.api(user.getCommunity());

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

}]);

/**
* Recipe Controller
*/
bc.controller('recipeController', ['$scope', '$http',
    function ($scope, $http, $routeParams){
    
    $scope.recipeList = true;

    /*
    * Ui function
    * Open panel to show detail of recipe
    */
    $scope.openRecipe = function(recipe){
        $scope.cocktailRecipe = recipe;
        console.log(recipe);
        $scope.recipeList = false;
    };

    /*
    * Ui function
    * Close panel to show detail of recipe
    */
    $scope.BackListRecipe = function(){
        $scope.recipeList = true;
    };

    /*
    * Ui function
    * Send the recipe to the master to make it !
    */
    $scope.blend = function(recipe) {
        Blender.Recipes.execute(recipe)
            .success(function(data) {
               console.log(data);
            });
    };

    
}]);

/**
* Admin Controller
*/
bc.controller('adminController', ['$scope', '$http', 'Modules', function ($scope, $http, Modules){

}]);
