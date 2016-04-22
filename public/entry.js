"use strict";

/*global tasksByDay, somedayTasks, require */
var _ = require("underscore"),
    moment = require("moment");

// Include NativeView to exclude jQuery
require("backbone.nativeview");

var Task = require("./models/task"),
    Day = require("./models/day"),
    Week = require("./models/week"),
    WeekView = require("./views/week"),
    AppView = require("./views/app");

var populatedIntervalGenerator = function (beginningDay, endingDay) {
    var numberOfDays = endingDay.diff(beginningDay, "days") + 1,
        days = [];

    var processed = _.map(tasksByDay, function (dayArray) {
        return _.map(dayArray, function (task) {
            return Task.createFromJson(task);
        });
    });

    _(numberOfDays).times(function (i) {
        var thisDate = beginningDay.clone().add(i, "days"),
            models = _.find(processed, function (dayArray) {
                if (dayArray[0]) {
                    return moment(dayArray[0].get("dueDate")).isSame(thisDate, "day");
                }
            
                return false;
            }),
            newDay = new Day({
                date: thisDate,
                models: models
            });
        
        days.push(newDay);
    });

    return days;
};

var somedayGenerator = function () {
    var days = [];

    var processed = _.map(somedayTasks, function (dayArray) {
        return _.map(dayArray, function (task) {
            return Task.createFromJson(task);
        });
    });

    _(7).times(function (i) {
        var models = _.find(processed, function (dayArray) {
            if (dayArray[0]) {
                return dayArray[0].get("somedayColumn") === i;
            }
    
            return false;
        });
        
        days.push(new Day({
            somedayColumn: i,
            dueDate: null,
            models: models
        }));
    });

    return days;
};

var today = moment().startOf("day"),
    firstDayOfWeek = today.clone().startOf("week"),
    lastDayOfWeek = today.clone().endOf("week"),
    days = populatedIntervalGenerator(firstDayOfWeek, lastDayOfWeek),
    week = new Week(days),
    somedayDays = somedayGenerator(),
    somedayWeek = new Week(somedayDays);

var appView = new AppView();

window.document.title = week.getTaskCount() + " tasks :: todo.designedbyscience.com";

appView.weekView = new WeekView({ model: week });
appView.weekView.somedayWeek = false;
appView.somedayView = new WeekView({ model: somedayWeek });
appView.somedayView.somedayWeek = true;

document.body.appendChild(appView.render().el);
