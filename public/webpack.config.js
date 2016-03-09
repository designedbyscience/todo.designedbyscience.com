"use strict";

var webpack = require("webpack");

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /backbone\.js$/, loader: 'imports?define=>false' }
        ]
    },        
    plugins: [
        new webpack.IgnorePlugin(/^jquery$/),
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en-gb)$/)
    ]
};