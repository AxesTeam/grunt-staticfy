var exec = require('child_process').exec;
var path = require('path');

module.exports = {
    staticfy: function (opts, callback) {
        var url = opts.url,
            dest = opts.dest,
            inject_script = opts.inject_script,
            wait_request = opts.wait_request;

        var phantomProgram = path.join(__dirname, '/phantomScript/staticfyPage.js');

        var cmd = 'phantomjs "' + phantomProgram + '" ' +
            url + ' ' +
            dest + ' "' +
            inject_script + '" ' +
            wait_request;
        console.log(cmd);
        exec(cmd, callback);
    }
};