import shoe from 'shoe';
import muxrpc from 'muxrpc';
import pull from 'pull-stream';
import pullWs from 'pull-ws';
import toBuffer from 'blob-to-buffer';
import Utility from './Utility';

export default class Connector
{
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

        var commands = muxrpc(this.api, null) ();
        var commandStream = commands.createStream();

        // pull ws is returning a blob and no buffer!
        var blobToBuffer = function (read) {
            return (end, cb) => {
                read(end, (end, data) => {
                    toBuffer(data, cb);
                });
            };
        };

        pull(commandStream, pullWs(socket), blobToBuffer, commandStream);

        commands.hello('world', (err,  result) => {
            console.log(result);
        });

        pull(commands.stuff(), pull.drain(console.log.bind(console)));

    };
}
