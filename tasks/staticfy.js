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

    grunt.registerMultiTask('staticfy', 'Staticfy your website', function () {
        var done = grunt.task.current.async();
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            server_host: 'http://localhost',
            server_port: 8481,
            inject_script: function () {

            },
            onfinish: function (str) {
                return str;
            }
        });
        var host = options.server_host;
        var port = options.server_port;

        // Convert to string, it would be used by phantomjs later.
        if (grunt.util.kindOf(options.inject_script) === 'function') {
            options.inject_script = options.inject_script
                .toString()
                .replace(/(function \(\) \{([\w\W]*?)\})/, "$2")
                .trim();
        }

        var file = this.files[0];
        var fileSrc = file.src[0];
        var fileBasename = path.basename(fileSrc);
        var wwwDir = path.dirname(fileSrc);
        grunt.log.writeln('fileBasename:' + fileBasename);
        grunt.log.writeln('wwwDir:' + wwwDir);

        if (!grunt.file.exists(fileSrc)) {
            // File not exist
            grunt.log.warn('Source file "' + fileSrc + '" not found.');
            return;
        }

        // Run a server to serve html files, we need a static server so we
        // wouldn't got a crossdomain error if the page use ajax or etc.
        var server = SimpleServer.start(wwwDir, port);

        var url = path.join(host + ':' + port, fileBasename);
        var phantomProgram = path.join(__dirname, '/phantom/staticfy_url.js');

        var cmd = 'phantomjs "' +
            phantomProgram + '" ' +
            url + ' ' +
            file.dest + ' "' +
            options.inject_script + '"';

        // Staticfy the page using phantomjs.
        grunt.log.writeln(cmd);
        exec(cmd, function () {
            // After phantom, read the dest html file then normalizelf and make some changes.
            var str = grunt.file.read(file.dest);
            str = grunt.util.normalizelf(str);
            str = options.onfinish(str);

            // Write the result
            grunt.file.write(file.dest, str);
            grunt.log.writeln('File "' + file.dest + '" created.');

            // Tells Grunt that an async task is complete
            done();
            // Close the static Server
            server.close();
        });
    });
};
