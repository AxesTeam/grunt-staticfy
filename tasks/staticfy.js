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

        // Convert to string, it would be used by phantomjs later.
        options.inject_script = options.inject_script
            .toString()
            .replace(/(function \(\) \{([\w\W]*?)\})/, "$2")
            .trim();

        var f = this.files[0];
        var filepath = f.src[0];

        if (!grunt.file.exists(filepath)) {
            // File not exist
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return;
        }

        var arr = filepath.split('/');
        var filename = arr.pop();
        var wwwDir = arr.join('/');

        grunt.log.writeln('filename:' + filename);
        grunt.log.writeln('wwwDir:' + wwwDir);

        // Run a server to server html files, we need a static server to avoid crossdomain.
        var server = SimpleServer.start(wwwDir, options.server_port);

        var pageUrl = options.server_host + ':' + options.server_port + '/' + filename;
        var staticfy_url_js = path.join(path.dirname(module.filename), '/phantom/staticfy_url.js');
        var cmd = 'phantomjs "' +
            staticfy_url_js + '" ' +
            pageUrl + ' ' +
            f.dest + ' "' +
            options.inject_script + '"';

        // Staticfy the page with phantomjs
        grunt.log.writeln(cmd);
        exec(cmd, function () {
            // After phantom, read the dest html file normalizelf and make some changes
            var str = grunt.file.read(f.dest);
            str = grunt.util.normalizelf(str);
            str = options.onfinish(str);

            // Write the result
            grunt.file.write(f.dest, str);
            grunt.log.writeln('File "' + f.dest + '" created.');

            // Tells Grunt that an async task is complete
            done();
            // Close the static Server
            server.close();
        });
    });
};
