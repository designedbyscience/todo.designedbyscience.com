define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),
        moment = require("moment"),
        Task = require("./task.js");

    var Day = Backbone.Model.extend({
        model: Task,
        defaults: {
            "models": []
        },
        initialize: function () {
            _.each(this.get("models"), function (t) {
                t.setCurrentDay(this);
                this.listenTo(t, "change:currentDay", this.removeTask);
            }.bind(this));
        },
        fetchTasksFromServer: function () {
            var collection = new Backbone.Collection();
            collection.model = Task;
            collection.url = "todos";

            var self = this;
            
            collection.fetch({
                data: {
                    date: this.get("date")
                },
                success: function (collection) {
                    self.set("models", collection.models);
                }
            });
        },
        removeTask: function (taskToRemove) {
            var tasks = this.get("models");

            this.set("models", _.without(tasks, taskToRemove));
        },
        addTask: function (task) {
            var tasks = _.clone(this.get("models"));

            tasks.push(task);
            this.listenTo(task, "change:currentDay", this.removeTask);
            this.set("models", tasks);
        },
        isDisabled: function () {
            return this.get("date") && moment(this.get("date")).isBefore(moment().startOf("day"));
        },
        createTask: function (text) {
            var newTask;
            
            if (text !== "") {
                if (this.get("date")) {
                    newTask = new Task({
                        title: text,
                        dueDate: this.get("date")
                    });
                } else {
                    newTask = new Task({
                        title: text,
                        somedayColumn: this.get("somedayColumn"),
                        dueDate: null
                    });
                }

                newTask.setCurrentDay(this);

                var tasks = _.clone(this.get("models"));
                tasks.push(newTask);

                this.listenTo(newTask, "change:currentDay", this.removeTask);

                this.set({ "models": tasks });
            }
        }
    });

    module.exports = Day;
});
