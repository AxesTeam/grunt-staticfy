var http = require('http');
var nodeStatic = require('node-static');

function startServer(wwwDir, port) {
    var fileServer = new nodeStatic.Server(wwwDir);
    return http.createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(port);
}

module.exports = {
    start: startServer
};