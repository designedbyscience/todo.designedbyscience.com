/* eslint-env node */

module.exports = function (grunt) {
    "use strict";
    
    grunt.initConfig({
        eslint: {
            options: {
                configFile: ".eslintrc.json",
                ignorePath: "bundle.js"
            },

            all: [
                "entry.js",
                "*.json",
                "views/**/*.js",
                "models/**/*.js",
                "test/**/*.js",
                "test/**/*.jsx",
                "!npm-shrinkwrap.json",
                "!manifest.json",
                "!package.json"
            ]
        },
        jscs: {
            main: {
                src: [
                    "entry.js",
                    "*.json",
                    "views/**/*.js",
                    "models/**/*.js"
                ],
                options: {
                    config: ".jscsrc"
                }
            },
        },
        jsdoc: {
            dist: {
                src: ["src"],
                options: {
                    destination: "docs/jsdoc",
                    recurse: true
                }
            }
        },
        jsonlint: {
            src: [
                "*.json",
                "src/**/*.json",
                "test/**/*.json"
            ]
        },
        lintspaces: {
            src: [
                "entry.js",
                "Gruntfile.js",
                "views/**/*.json",
                "views/**/*.js",
                "models/**/*.json",
                "models/**/*.js"
            ],
            options: {
                newline: true,
                newlineMaximum: 1
            }
        },
        // Utility tasks
        clean: {
            build: ["./build"]
        },
        copy: {
            htmlRelease: { src: "src/index.html", dest: "build/index.html" },
            htmlDebug: { src: "src/index-debug.html", dest: "build/index.html" }            
        },
        watch: {
            styles: {
                files: ["assets/css/*.scss"],
                tasks: ["sass"],
                options: {
                    spawn: false,
                    interrupt: true,
                    reload: true
                }
            },
            sources: {
                files: ["src/**/*"],
                options: {
                    interval: 500
                }
            },
            dependencies: {
                files: ["package.json"],
                tasks: ["checkDependencies"]
            }
        },
        // Build tasks
        webpack: {
            options: require("./webpack.config.js"),
            compile: {
                watch: false
            },
            watch: {
                watch: true,
                keepalive: true,
                failOnError: false
            }
        },
        uglify: {
            todo: {
                files: {
                    "bundle-min.js": ["bundle.js"]
                }
            
                
            }
        },
        sass: {
                options: {
                    sourceMap: true
                },
                dist: {
                    files: {
                        'assets/css/styles.css': 'assets/css/styles.scss'
                    }
                }
            },
        
        concurrent: {
            test: ["eslint", "jscs", "jsdoc", "jsonlint", "lintspaces"],
            build: {
                tasks: ["watch:styles", "watch:sources", "webpack:watch", "watch:dependencies"],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        checkDependencies: {
            this: {}
        }
    });

    grunt.loadNpmTasks("grunt-eslint");
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks("grunt-lintspaces");

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks("grunt-webpack");

    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-notify");
    grunt.loadNpmTasks("grunt-check-dependencies");

    grunt.registerTask("seqtest", "Runs the linter tests sequentially",
        ["eslint", "jscs", "lintspaces"]
    );
    grunt.registerTask("test", "Runs linter tests",
        ["checkDependencies", "concurrent:test"]
    );
    grunt.registerTask("compile", "Builds todo manager front-end for production",
        ["checkDependencies", "test", "clean:build",
         "sass", "webpack:compile", "uglify", "clean:i18n"]
    );
    grunt.registerTask("debug", "Builds todo manager front-end for development and debugging",
        ["checkDependencies", "clean", "sass", "concurrent:build"]
    );
    grunt.registerTask("default", "Runs linter tests", ["test"]);
};
