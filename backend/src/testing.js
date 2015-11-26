    // file is not transpiled. NO ES6
// babel will transpile files after it
require("babel-core/register");
var path = require('path'),
    fs = require('fs');

require("fs").readdirSync(__dirname).forEach(function(file) {
    var ext = path.extname(file),
        base = path.basename(file, '.js');
    if (ext == ".js" && ['index', 'testing'].indexOf(base) == -1)
        exports[base] = require("./" + base).Tests;
});
