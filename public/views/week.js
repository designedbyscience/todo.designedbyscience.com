define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone");

    // Include NativeView to exclude jQuery
    require("backbone.nativeview");

    var DayView = require("./day.js");
    
    var WeekView = Backbone.NativeView.extend({
        tagName: "div",
        className: "week",
        render: function () {
            var week = this.el;

            this.model.each(function (day) {
                week.appendChild((new DayView({ model: day })).render().el);
            });

            return this;
        }
    });

    module.exports = WeekView;
});
