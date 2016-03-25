define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        Day = require("./day");

    var Week = Backbone.Collection.extend({
        model: Day,
        getPreviousDay: function () {
            // Look at first day in list and determine previous day
            
            var firstDay = this.models[0],
                firstDate = this.getDate("date"),
                previousDate = this.subtract(1, 'days'),
                previousDay = new Day({
                    date: previousDate
                });
            
            // Clone models and add to front
            
            previousDay.fetchTasksFromServer();
            // this.models.unshift(newDay)
        }
    });

    module.exports = Week;
});
