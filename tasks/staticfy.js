/*
 * grunt-staticfy
 * 
 *
 * Copyright (c) 2014 Weilao
 * Licensed under the MIT license.
 */
"use strict";

module.exports = function (grunt) {
    var exec = require('child_process').exec;

    grunt.registerMultiTask('staticfy', 'Staticfy your website', function () {
        // Tells Grunt that an async task is complete
        var done = grunt.task.current.async();
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            server_host: '',
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

        var pageUrl = options.server_host + filepath;

        var cmd = 'phantomjs tasks/phantom/staticfy_url.js ' +
            pageUrl + ' ' +
            f.dest + ' "' +
            options.inject_script + '"';

        grunt.log.writeln(cmd);

        // Staticfy the page with phantomjs
        exec(cmd, function () {

            // 读取静态化完毕的 html 文件
            var str = grunt.file.read(f.dest);
            str = grunt.util.normalizelf(str);
            str = options.onfinish(str);

            // 重新输出 html 文件
            grunt.file.write(f.dest, str);
            grunt.log.writeln('File "' + f.dest + '" created.');

            // 告诉 grunt 任务执行完毕
            done();
        });
    });
};
