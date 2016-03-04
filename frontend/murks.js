var rc =  require('./reacttoken');
var util = require('util');

if (require.main === module)
{
    console.log(util.inspect(rc,true,100));
}
