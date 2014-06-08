/**
 *
 */
var bc = angular.module('blenderController', []);

var token;

/**
* Connection
*/
bc.controller('connectionController', ['$scope', '$http', '$location', 'Community', 'User',
    function($scope, $http, $location, Community, User){

    /*
    * Login without account
    * => Redirect to the route home with param "master"
    */
    $scope.LoginWithOutAccount = function(){
        $location.path("/home/master");
    }

    /*
    * Login with account
    * [ Check the form
    *   Get the Response of api
    *   Redirect to the route home with param "community" ]
    * @param {bool} Angular validation
    */
    $scope.loginWithAccount = function(isValid){

        if(isValid){
            
            // Créate new user
            var user = User.build();
            user.SetUserName($scope.user.userName);
            user.setEmail($scope.user.email);
            user.setCommunity($scope.user.community);

            // Send data to community api
            Community.User.connect(user, $scope.user.password)
                .success(function(response){

                    console.log(response);

                    if(response.status == false){
                        $scope.noValid = true;
                        $scope.errorMessage = 'User Name or Password are invalide';
                    }else{
                        $location.path("/home/community");
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
bc.controller('homeController', ['$scope', '$http', '$routeParams', '$cookies', 'Blender', 'Community',
    function($scope, $http, $routeParams, $cookies, Blender, Community){

    switch($routeParams.action){
        // Display local recipes
        case 'master':

            $scope.recipeCommunity = false;
            $scope.recipeMaster = true;
            Blender.Recipes.getAll()
                .success(function(data) {
                    $scope.recipes = data;
                })
                .error(function(data) {
                    console.log('Error :' + data);
                });

        break;
        // Display community recipes
        case 'community':

            $scope.recipeCommunity = true;
            $scope.recipeMaster = false;
            Community.Recipes.getAll()
                .success(function(){
                    $scope.recipe = data;
                })
                .error(function(data){
                    console.log('Error :' +  data);
                })

        break;
    }  

}]);

/**
* Recipe Controller
*/
bc.controller('recipeController', ['$scope', '$http','Blender', 'Community',
    function ($scope, $http, $routeParams, Blender, Community){
    
    $scope.recipeList = true;

    // Open Panel for the recipe details
    $scope.openRecipe = function(recipe){
        $scope.cocktailRecipe = recipe;
        console.log(recipe);
        $scope.recipeList = false;
    };

    $scope.blend = function(recipe) {
        Blender.Recipes.execute(recipe)
            .success(function(data) {
               console.log(data);
            });
    };

    // Close Panel for the recipe details
    $scope.BackListRecipe = function(){
        $scope.recipeList = true;
    };

}]);

/**
* Admin Controller
*/
bc.controller('adminController', ['$scope', '$http', 'Modules', function ($scope, $http, Modules){

}]);
