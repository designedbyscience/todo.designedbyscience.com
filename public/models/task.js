define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        moment = require("moment");

    Backbone.ajax = require("backbone.nativeajax");
        
    var Task = Backbone.Model.extend({
        defaults: {
            "title": "New Task",
            "link": null,
            "dueDate": moment().startOf("day"),
            "pushCount": 0,
            "complete": false,
            "somedayColumn": -1,
            "postponed": false
        },
        url: "todo",
        initialize: function () {
            if (this.isNew()) {
                this.save();
            }
        },
        parse: function (response) {
            return {
                "title": response.task_text,
                "id": response.id,
                "pushCount": response.push_count,
                "somedayColumn": response.someday_column,
                "dueDate": response.due_date ? moment(response.due_date) : null,
                "complete": response.completed
            };
        },
        toggleComplete: function () {
            this.set({ "complete": !this.get("complete") });
            this.save();
        },
        setCurrentDay: function (currentDay) {
            this.currentDay = currentDay;
            this.trigger("change:currentDay", this);
        },
        isDisabled: function () {
            return this.get("dueDate") && moment(this.get("dueDate")).isBefore(moment().startOf("day"));
        },
        moveDay: function (newDay) {
            this.setCurrentDay(newDay);

            if (newDay.get("date")) {
                this.set("dueDate", newDay.get("date"));
                this.set("somedayColumn", -1);
            } else {
                this.set("dueDate", null);
                this.set("somedayColumn", newDay.get("somedayColumn"));
            }

            newDay.addTask(this);
            this.save();
        }
    }, {
        createFromJson: function (json) {
            return new Task({
                "title": json.task_text,
                "id": json.id,
                "pushCount": json.push_count,
                "somedayColumn": json.someday_column,
                "dueDate": json.due_date ? moment(json.due_date) : null,
                "complete": json.completed
            });
        }
    });

    module.exports = Task;
});
