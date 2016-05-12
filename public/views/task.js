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
            "mousedown": "handleMousedown",
            "dragstart": "handleDragStart"
        },
        handleDragStart: function (event) {
            event.dataTransfer.setData("text/plain", this.model.cid);
            window._dragTask = this.model;
        },
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
        },
        handleMousedown: function () {
            // Long click
            this.cancelClickTimer = setTimeout(function () {
                this.cancelClick = true;
                this.model.set("postponed", true);
            }.bind(this), 1000);
        },
        handleClick: function () {
            if (this.cancelClick) {
                this.cancelClick = false;
                return false;
            }
            
            clearTimeout(this.cancelClickTimer);

            if (this.model && !this.model.isDisabled()) {
                this.model.toggleComplete();
                this.render();
            }
        },
        render: function () {
            if (this.model) {
                if (this.model.get("complete")) {
                    this.el.classList.add("complete");
                } else {
                    this.el.classList.remove("complete");
                }
                
                if (this.model.get("postponed")) {
                    this.el.classList.add("postponed");
                } else {
                    this.el.classList.remove("postponed");
                }

                this.el.setAttribute("draggable", "true");
                this.el.setAttribute("data-postponed", this.model.get("postponed"));
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
