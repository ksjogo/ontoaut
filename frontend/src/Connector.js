import shoe from 'shoe';
import muxrpc from 'muxrpc';
import pull from 'pull-stream';
import pullWs from 'pull-ws';

export default class Connector
{
    // manual sync for the moment
    get api()
    {
        return {
            hello: 'async',
            stuff: 'source'
        };
    }

    constructor(host = 'ws://localhost:3001/')
    {
        var socket = new WebSocket(host);

        pull(
            pull.infinite(function() {
                return 'hello @ ' + Date.now();
            }),
            // throttle so it doesn't go nuts
            pull.asyncMap(function(value, cb) {
                setTimeout(function() {
                    cb(null, value);
                }, 100);
            }),
            pullWs.sink(socket)
        );

        // debugger;
        // var commands = muxrpc(this.api, null) ();
        // var commandStream = commands.createStream();

        // pull(commandStream, pullWs(socket), commandStream);

        // commands.hello('world', (err,  result) => {
        //     console.log(err);
        //     console.log(result);
        // });

    };
}
