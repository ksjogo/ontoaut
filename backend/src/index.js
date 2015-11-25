    // file is not transpiled. NO ES6
// babel will transpile files after it
require("babel-core/register");
var Server = require('./Server.js').default,
    server = new Server();
server.run();
