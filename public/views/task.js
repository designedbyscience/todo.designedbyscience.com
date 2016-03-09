define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone");
 
    // Include NativeView to exclude jQuery
    require("backbone.nativeview");
    
    var TaskView = Backbone.NativeView.extend({
        tagName: "li",
        className: "task",
        events: {
            "click": "handleClick",
            "dragstart": "handleDragStart"
        },
        handleDragStart: function (event) {
            event.dataTransfer.setData("text/plain", this.model.cid);
            window._dragTask = this.model;
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        handleClick: function () {
            if (this.model && !this.model.isDisabled()) {
                this.model.toggleComplete();
                this.render();
            }
        },
        render: function () {

            if (this.model) {
                // debugger;            
                if (this.model.get("complete")) {
                    this.el.classList.add("complete");
                } else {
                    this.el.classList.remove("complete");
                }

                this.el.setAttribute("draggable", "true");

                this.el.setAttribute("data-duedate", this.model.get("dueDate"));
                this.el.setAttribute("data-someday", this.model.get("somedayColumn"));
                
                this.el.innerHTML = this.model.get("title");
                this.initialized = true;
            }

            return this;
        }
    });

    module.exports = TaskView;
});
