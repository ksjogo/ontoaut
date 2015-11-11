require("babel-core/register");

var Server = require('./Server.js').Server;
var server = new Server();
server.run();
