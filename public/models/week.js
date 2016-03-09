define(function (require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        Day = require("./day");

    var Week = Backbone.Collection.extend({
        model: Day
    });

    module.exports = Week;
});
