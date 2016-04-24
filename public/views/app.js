define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone");

    // Include NativeView to exclude jQuery
    require("backbone.nativeview");

    var AppView = Backbone.NativeView.extend({
        tagName: "div",
        className: "application wrap",
        initialize: function (views) {
            this.weekView = views.weekView;
            this.weekView.somedayWeek = false;
            
            this.somedayView = views.somedayView;
            this.somedayView.somedayWeek = true;
            
            this.listenTo(this.weekView.model, "count", this.updateTitle);
            
            this.updateTitle();
        },
        updateTitle: function () {
            window.document.title = this.weekView.model.getTaskCount() + " tasks :: todo.designedbyscience.com";
        },
        render: function () {
            this.el.appendChild(this.weekView.render().el);
            this.el.appendChild(this.somedayView.render().el);

            return this;
        }
    });

    module.exports = AppView;
});
