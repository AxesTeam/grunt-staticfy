/*
 * grunt-staticfy
 * 
 *
 * Copyright (c) 2014 Weilao
 * Licensed under the MIT license.
 */
"use strict";

module.exports = function (grunt) {
    var SimpleServer = require('./simpleServer.js');
    var exec = require('child_process').exec;
    var path = require('path');
    var _ = require('underscore');

    grunt.registerMultiTask('staticfy', 'Staticfy your website', function () {
        var injectScript, options, gruntDone;

        // Merge task-specific and/or target-specific options with these defaults.
        gruntDone = _.after(this.files.length, grunt.task.current.async());
        options = this.options({
            server_host: 'http://localhost',
            server_port: 8481,
            query_string: '',
            cwd: '',
            inject_script: function () {

            },
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

        _.each(this.files, function (file, i) {
            var src, wwwDir, basePath, server, url;

            src = file.src[0];
            wwwDir = options.cwd || path.dirname(src);
            basePath = src.replace(wwwDir, '').replace(/\/$/, '');
            grunt.log.writeln('File "' + basePath + '" staticfying.');

            if (!grunt.file.exists(src)) {
                // File not exist
                grunt.log.warn('Source file "' + src + '" not found.');
                return;
            }

            // Run a server to serve html files, we need a static server so we
            // wouldn't got a crossdomain error if the page use ajax or etc.
            server = SimpleServer.start(wwwDir, options.server_port + i);

            url = options.server_host + ':' + (options.server_port + i) + '/' + basePath;
            if (options.query_string) url += '?' + options.query_string;

            // call phantom
            phantom(url, file.dest, injectScript, options.wait_request, function () {

                // After phantom, read the dest html file then normalizelf and make some changes.
                var str = grunt.file.read(file.dest);
                str = grunt.util.normalizelf(str);
                str = options.onfinish(str);
                grunt.file.write(file.dest, str);

                grunt.log.writeln('File "' + file.dest + '" created.');

                // Close the static Server
                server.close();

                // Tells Grunt that an async task is complete
                gruntDone();
            });
        });
    });

    // Staticfy the page using phantomjs.
    function phantom(url, dest, injectScript, waitRequest, callback) {
        var phantomProgram, cmd;

        phantomProgram = path.join(__dirname, '/phantom/savePage.js');

        cmd = 'phantomjs "'
        + phantomProgram + '" '
        + url + ' '
        + dest + ' "'
        + injectScript + '" '
        + waitRequest;

        exec(cmd, callback);
        grunt.log.writeln(cmd);
    }
};