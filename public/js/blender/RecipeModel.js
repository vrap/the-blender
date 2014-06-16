/**
 * Each services for the Blender application
 */
angular.module('blenderModelRecipe', [])

/**
* Class User
*/
.factory('RecipeModel', [function () {
 
    /**
    * Constructor, with class name
    */
    function Recipe() {
        this.name;
        this.author;
        this.steps = [];
    }

    /**
    * Public method
    * @return {string} name
    */
    Recipe.prototype.getName = function () {
        return this.name;
    };

    /**
    * Public method
    * @return {object} author
    */
    Recipe.prototype.getAuthor = function () {
        return this.author;
    };

    /**
    * Public method
    * @return {json} all steps
    */
    Recipe.prototype.getSteps = function () {
        return this.steps;
    };

    /**
    * Public method
    * @param {string} name
    * @return {void}
    */
    Recipe.prototype.setName = function (name) {
        this.name = name;
    };

    /**
    * Public method
    * @param {object} user
    * @return {void}
    */
    Recipe.prototype.setAuthor = function (author) {
        this.author = author;
    };

    /**
    * Public method
    * @param {json} all steps
    */
    Recipe.prototype.setSteps = function (step) {
        this.steps = steps;
    };

    /**
    * Public method
    * @param {int} order
    * @param {string} action
    * @param {json} value
    */
    Recipe.prototype.pushStep = function (order, action, value) {
        this.steps.push({order: order, action: action, value: value});
    };

    /**
     * Public mehod
     * Format data to post in string format
     * @return {string} Data format to send in post request
     */
    Recipe.prototype.formatToSend = function(){

        // Create data
        var data = {}
        data.author = this.getAuthor().getUuid();
        data.name = this.getName();
        data.steps = [];

        // Get all steps of recipe
        var thisSteps = this.getSteps();
        for(var key in thisSteps){
            var step = {};
            step.action = thisSteps[key].action;
            step.order = thisSteps[key].order;

            // Get all parameters of recipe
            step.parameters = [];
            step.parameters.push(
                {
                    name : 'ingredient',
                    value : thisSteps[key].value.uuid
                });
            step.parameters.push(
                {
                    name : 'dosage',
                    value : thisSteps[key].value.parameters
                });
            data.steps.push(step);
        }

        console.log(data);
        return 'data=' + JSON.stringify(data);

    }

    /**
    * Static method
    * Create new user
    * @return {User} (empty)
    */
    Recipe.build = function(data) {
        return new Recipe();
    };
    
    /**
    * Return the constructor function
    */
    return Recipe;

}])