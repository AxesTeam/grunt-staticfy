var page = require('webpage').create();
var fs = require('fs');
var system = require('system');
var args = system.args;

var src = args[1];
var dest = args[2];
var inject_script = args[3] || ';';
var wait_request = args[4] || '';

console.log('src:', src);
console.log('dest:', dest);
console.log('eval:', inject_script);
console.log('wait_request:', wait_request);

page.open(src, function (s) {
    if (inject_script !== ';') {
        page.evaluate(function (evalStr) {
            eval(evalStr);
        }, inject_script);
    }
    if (!wait_request) writeFile();
});

// 输出页面 console 内容
page.onConsoleMessage = function (msg) {
    console.log(msg);
};

page.onResourceReceived = function (response) {
    if (response.stage === 'end' && response.url.indexOf(wait_request) > -1) {
        writeFile();
    }
};

function writeFile() {
    setTimeout(function () {
        fs.write(dest, page.content, 'w');
        console.log('phantom.exit');
        phantom.exit();
    }, 0);
}