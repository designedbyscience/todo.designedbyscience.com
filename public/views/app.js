define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone");

    // Include NativeView to exclude jQuery
    require("backbone.nativeview");

    var AppView = Backbone.NativeView.extend({
        tagName: "div",
        className: "application wrap",
        render: function () {
            this.el.appendChild(this.weekView.render().el);
            this.el.appendChild(this.somedayView.render().el);

            return this;
        }
    });

    module.exports = AppView;
});
