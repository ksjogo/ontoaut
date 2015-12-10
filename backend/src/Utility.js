export default
{
    pullthroughLog (readOrPrefix)
    {
        if (typeof readOrPrefix === 'string' || readOrPrefix instanceof String)
            return function (read) {
                return function (end, cb) {
                    read(end, function (end, data) {
                        console.log(readOrPrefix);
                        console.log(data);
                        cb(end, data);
                    });
                };
            };
        else
            return function (end, cb) {
                readOrPrefix(end, function (end, data) {
                    console.log(data);
                    cb(end, data);
                });
            };
    }
};
