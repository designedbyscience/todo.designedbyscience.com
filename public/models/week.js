define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        moment = require("moment"),
        Day = require("./day");

    var Week = Backbone.Collection.extend({
        model: Day,
        getTaskCount: function () {
          return this.reduce(function(memo, model) { return memo + model.uncompletedTaskCount() }, 0);            
        },
        getPreviousDay: function () {
            // Look at first day in list and determine previous day
            
            var firstDay = this.at(0),
                firstDate = firstDay.get("date"),
                previousDate = moment(firstDate).subtract(1, "days"),
                previousDay = new Day({
                    date: previousDate
                });

            previousDay.fetchTasksFromServer();

            this.unshift(previousDay);
            this.pop();
        },
        getNextDay: function () {
            // Look at last day in list and determine previous day
            
            var firstDay = this.at(this.length - 1),
                firstDate = firstDay.get("date"),
                nextDate = moment(firstDate).add(1, "days"),
                nextDay = new Day({
                    date: nextDate
                });
            
            nextDay.fetchTasksFromServer();
            
            this.push(nextDay);
            this.shift();
        }
    });

    module.exports = Week;
});
