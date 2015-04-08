/*
 * grunt-staticfy
 * 
 *
 * Copyright (c) 2014 Weilao
 * Licensed under the MIT license.
 */
"use strict";

module.exports = function (grunt) {
    var SimpleServer = require('./lib/simpleServer.js');
    var exec = require('child_process').exec;
    var path = require('path');
    var _ = require('underscore');

    grunt.registerMultiTask('staticfy', 'Staticfy your website', function () {
        var injectScript, options, gruntDone, fakeFiles;

        gruntDone = grunt.task.current.async();
        // Merge task-specific and/or target-specific options with these defaults.
        options = this.options({
            query_string: '',
            cwd: '',
            inject_script: '',
            onfinish: function (str) {
                return str;
            },
            wait_request: ' '
        });

        // Convert to string, it would be used by phantomjs later.
        if (grunt.util.kindOf(options.inject_script) === 'function') {
            injectScript = options.inject_script
                .toString()
                .replace(/(function \(\) \{([\w\W]*?)\})/, "$2")
                .trim();
        } else {
            injectScript = options.inject_script;
        }

        fakeFiles = _.map(this.files, function (file) {
            var src, wwwDir, basePath;

            src = file.src[0];
            wwwDir = options.cwd || path.dirname(src);
            basePath = src.replace(wwwDir, '').replace(/(^\/|\/$)/g, '');

            grunt.log.writeln('File "' + basePath + '" staticfying.');

            if (!grunt.file.exists(src)) {
                // File not exist
                grunt.log.warn('Source file "' + src + '" not found.');
                return;
            }

            var url, queryString;
            queryString = options.query_string;
            url = 'http://localhost:{{port}}/' + basePath;
            if (queryString) url += '?' + queryString;

            return {
                src: src,
                dest: file.dest,
                wwwDir: wwwDir,
                url: url
            };
        });

        var fileGroups = _.groupBy(fakeFiles, 'wwwDir');
        var restGroupCount = _.size(fileGroups);
        _.each(fileGroups, function (files, wwwDir) {

            // Run a server to serve html files, we need a static server so we
            // wouldn't got a crossdomain error if the page use ajax or etc.
            SimpleServer.start(wwwDir, function (server) {
                // Replace {{port}} with server.port
                files = _.each(files, function (opt) {
                    opt.url = opt.url.replace('{{port}}', server.port);
                });

                // Call phantom/savePage.js
                phantom(files, injectScript, options.wait_request, function () {
                    _.each(files, function (file) {
                        // After phantom, read the dest html file then normalizelf() and apply onfinish() callback.
                        var str = grunt.file.read(file.dest);
                        str = grunt.util.normalizelf(str);
                        str = options.onfinish(str);
                        grunt.file.write(file.dest, str);
                        grunt.log.writeln('File "' + file.dest + '" created.');
                    });
                    fileCountUnderThisServer--;
                    if (fileCountUnderThisServer === 0) {
                        gruntDone();
                    }
                });
            });
        });
    });

    function phantom(files, injectScript, waitRequest, callback) {
        var phantomProgram, cmd;

        phantomProgram = path.join(__dirname, '/lib/phantom/savePage.js');

        cmd = 'phantomjs "'
        + phantomProgram + '" "'
        + escape(JSON.stringify(files)) + '" "'
        + injectScript + '" '
        + waitRequest;
        exec(cmd, callback);
        // grunt.log.writeln(cmd);
    }
};