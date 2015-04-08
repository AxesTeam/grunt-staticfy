var page = require('webpage').create();
var fs = require('fs');
var system = require('system');
var args = system.args;

var file, url, dest;
var files = unescape(args[1]);
var inject_script = args[2] || 'no';
var wait_request = args[3] || 'no';

console.log('files:', files);
console.log('eval:', inject_script);
console.log('wait_request:', wait_request);

files = JSON.parse(files);

run();

function run() {
    file = files.pop();
    url = file.url;
    dest = file.dest;

    page.open(url, function () {
        if (inject_script !== 'no') {
            page.evaluate(function (evalStr) {
                eval(evalStr);
            }, inject_script);
        }
        if (wait_request == 'no') writeFile();
    });

    // Show page console
    page.onConsoleMessage = function (msg) {
        console.log(msg);
    };

    page.onResourceReceived = function (response) {
        if (response.stage === 'end' && wait_request != 'no' && response.url.indexOf(wait_request) > -1) {
            // Timeout 0 for execute page script.
            console.log(page.content);
            setTimeout(function () {
                writeFile();
            }, 0);
        }
    };
}

function writeFile() {
    console.log('file created:', dest);
    fs.write(dest, page.content, 'w');
    if (files.length === 0) {
        console.log('phantom.exit');
        phantom.exit();
    } else {
        run();
    }
}