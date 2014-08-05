/*
 * grunt-staticfy
 * 
 *
 * Copyright (c) 2014 Weilao
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        // Configuration to be run (and then tested).
        staticfy: {options:{

        },
            staticfy_simple_page: {
                files: {
                    'tmp/simple.html': ['test/fixtures/simple.html']
                }
            },
            staticfy_simple2_page: {
                files: {
                    'tmp/simple2.html': ['test/fixtures/simple2.html']
                }
            },
            option_inject_script: {
                options: {
                    inject_script: function () {
                        document.body.innerHTML = 'this line is made by inject script';
                    }
                },
                files: {
                    'tmp/inject_script.html': ['test/fixtures/test.html']
                }
            },
            option_on_finish: {
                options: {
                    onfinish: function (str) {
                        grunt.log.writeln(str.replace(/\<!-- remove start --\>[\w\W]*\<!-- remove end --\>/gi, ''));
                        return str.replace(/\<!-- remove start --\>[\w\W]*\<!-- remove end --\>/gi, '');
                    }
                },
                files: {
                    'tmp/onfinish.html': 'test/fixtures/comment.html'
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'staticfy', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['test']);
};