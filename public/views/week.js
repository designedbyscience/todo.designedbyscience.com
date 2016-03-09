define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone");

    // Include NativeView to exclude jQuery
    require("backbone.nativeview");

    var DayView = require("./day.js");

    var WeekView = Backbone.NativeView.extend({
        tagName: "div",
        className: "week",
        events: {
            "click .previous": "getPreviousDay",
            "click .next": "getNextDay"
        },
        initialize: function () {
            this.listenTo(this.model, "update", this.render);
        },
        getPreviousDay: function () {
            this.model.getPreviousDay();
        },
        getNextDay: function () {
            this.model.getNextDay();
        },
        render: function () {
            var week = this.el,
                dayContainer;

            if (!this.initialized) {
                if (!this.somedayWeek) {
                    var previousButton = document.createElement("div");
                    previousButton.innerHTML = "Prev";
                    previousButton.classList.add("button");
                    previousButton.classList.add("previous");
                
                    var nextButton = document.createElement("div");
                    nextButton.innerHTML = "Next";
                    nextButton.classList.add("button");
                    nextButton.classList.add("next");

                    week.appendChild(previousButton);
                    week.appendChild(nextButton);
                }

                dayContainer = document.createElement("div");
                dayContainer.classList.add("day-container");

                week.appendChild(dayContainer);
                this.initialized = true;
            } else {
                dayContainer = week.querySelector(".day-container");
                dayContainer.innerHTML = "";
            }

            this.model.each(function (day) {
                dayContainer.appendChild((new DayView({ model: day })).render().el);
            });

            return this;
        }
    });

    module.exports = WeekView;
});
