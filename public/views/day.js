define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        Backbone = require("backbone"),
        moment = require("moment");

    // Include NativeView to exclude jQuery
    require("backbone.nativeview");

    var TaskView = require("./task.js");

    // Hold dates, creates tasks
    // Maybe should just be a view?
    var DayView = Backbone.NativeView.extend({
        tagName: "div",
        className: "day",
        events: {
            "keyup input": "handleInputCommit",
            "focusin input": "handleInputFocus",
            "focusout input": "handleInputBlur",
            "dragover": "handleDragOver",
            "dragleave": "handleDragLeave",
            "dragenter": "handleDragEnter",
            "drop": "handleDrop"
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        handleDragEnter: function () {
            // event.preventDefault();
        },
        handleDragOver: function (event) {
            if (window._dragTask.currentDay !== this.model && !this.model.isDisabled()) {
                this.el.classList.add("dragover");
                event.preventDefault();
            }
        },
        handleDragLeave: function () {
            this.el.classList.remove("dragover");
        },
        handleDrop: function () {
            // var data = event.dataTransfer.getData("text/plain");

            var dropTask = window._dragTask;
            window._dragTask = null;

            dropTask.moveDay(this.model);

            this.el.classList.remove("dragover");
            // Need to find the original task
        },
        handleInputFocus: function () {
        },
        handleInputBlur: function () {
        },
        handleInputCommit: function (e) {
            if (e.keyCode === 13) {
                var input = this.el.querySelector("input");
                this.model.createTask(input.value);

                input.value = "";
            }
        },
        render: function () {
            var el = this.el,
                taskList,
                isSomedayColumn = !this.model.get("date");

            // Split rendering into uninitialized requirements and update requirements
            if (!this.initialized) {
                if (!isSomedayColumn) {
                    var dayTitleEl = document.createElement("h2"),
                        dayMonthTitleEl = document.createElement("h2");

                    dayTitleEl.innerHTML = moment(this.model.get("date")).format("dddd");
                    dayMonthTitleEl.innerHTML = moment(this.model.get("date")).format("MMM D");

                    el.appendChild(dayTitleEl);
                    el.appendChild(dayMonthTitleEl);
                }

                var input = document.createElement("input");
                input.type = "text";

                el.appendChild(input);

                taskList = document.createElement("ul");
                
                el.appendChild(taskList);
                this.initialized = true;
            } else {
                taskList = el.querySelector("ul");
            }

            if (!isSomedayColumn && this.model.isDisabled()) {
                el.classList.add("disabled");
            } else {
                el.classList.remove("disabled");
            }

            taskList.innerHTML = "";

            _.each(this.model.get("models"), function (task) {
                taskList.appendChild(new TaskView({ model: task }).render().el);
            });

            var numberOfTasks = this.model.get("models") ? this.model.get("models").length : 0;

            _(10 - numberOfTasks).times(function () {
                taskList.appendChild(new TaskView().render().el);
            });

            return this;
        }
    });

    module.exports = DayView;
});
