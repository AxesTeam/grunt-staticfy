'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.staticfy = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },

    // 测试预编译1
    staticfy_simple_page: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/simple.html');
        var expected = grunt.file.read('test/expected/simple.html');
        test.equal(actual, expected, 'staticfy simple fail');

        test.done();
    },

    // 测试预编译2
    staticfy_simple2_page: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/simple2.html');
        var expected = grunt.file.read('test/expected/simple2.html');
        test.equal(actual, expected, 'staticfy simple2 fail');

        test.done();
    },

    // 测试 inject_script 配置项
    option_inject_script_function: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/inject_script_function.html');
        var expected = grunt.file.read('test/expected/inject_script.html');
        test.equal(actual, expected, 'inject_script(function) option fail');

        test.done();
    },

    // 测试 inject_script 配置项为字符串的情况
    option_inject_script_string: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/inject_script_string.html');
        var expected = grunt.file.read('test/expected/inject_script.html');
        test.equal(actual, expected, 'inject_script(string) option fail');

        test.done();
    },

    // 测试 onfinish 配置项
    option_on_finish: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/onfinish.html');
        var expected = grunt.file.read('test/expected/onfinish.html');
        test.equal(actual, expected, 'on_finish option fail');

        test.done();
    },

    // 测试异步配置项
    option_wait_request: function (test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/async.html');
        var expected = grunt.file.read('test/expected/async.html');
        test.equal(actual, expected, 'wait_request option fail');

        test.done();
    },
};
