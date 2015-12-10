import shoe from 'shoe';
import muxrpc from 'muxrpc';
import pull from 'pull-stream';
import pullWs from 'pull-ws';
import toBuffer from 'blob-to-buffer';
import Utility from './Utility';
import Api from './Api';

export default class Connector
{
    constructor(host = 'ws://localhost:3001/')
    {
        var socket = new WebSocket(host);

        var commands = muxrpc(Api, null) ();
        var commandStream = commands.createStream();

        // export for browser debugging
        if (window) {
            window.commands = commands;
            window.pull = pull;
        }

        // pull ws is returning a blob and no buffer!
        var blobToBuffer = function (read) {
            return (end, cb) => {
                read(end, (end, data) => {
                    toBuffer(data, cb);
                });
            };
        };

        pull(commandStream, pullWs(socket), blobToBuffer, commandStream);

        // copy remote api onto self
        for (var key in commands)
            if (key in Api)
                this[key] = commands[key].bind(commands);

        this.hello('world', (err,  result) => {
            console.log(result);
        });

        pull(this.stuff(0), pull.drain(console.log.bind(console)));
    };
}
