var page = require('webpage').create();
var fs = require('fs');
var system = require('system');
var args = system.args;

var src = args[1];
var dest = args[2];
var inject_script = args[3];

console.log('src:', src);
console.log('dest:', dest);
console.log('eval:', inject_script);

page.open(src, function (s) {
    if (inject_script != ';') {
        page.evaluate(function (evalStr) {
            eval(evalStr);
        }, inject_script);
    }
    fs.write(dest, page.content, 'w');
    phantom.exit();
});
// 输出页面 console 内容
page.onConsoleMessage = function (msg) {
    console.log(msg);
};
