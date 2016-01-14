import muxrpc from 'muxrpc';
import pull from 'pull-stream';
import pullWs from 'pull-ws';
import Utility from './Utility';
import Api from './Api';


export default class Connector
{
    constructor(host = 'ws://localhost:3001/')
    {
        debugger;
        this.host = host;
        // export for browser debugging
        if (window)
        {
            window.connector = this;
            window.pull = pull;
        }
    }

    connect()
    {
        debugger;
        var socket = new WebSocket(this.host);
        socket.onopen = (event => {
            var commands = muxrpc(Api, null) ();
            var commandStream = commands.createStream();

            pull(commandStream, pullWs(socket), Utility.blobToBuffer, commandStream);

            // copy remote api onto self
            for (var key in commands)
                if (key in Api)
                    this[key] = commands[key].bind(commands);
        });

        socket.onclose = (event => {
            console.log('socket closed, reconnect in 1 second.', event.reason);
            setTimeout(() => {
                this.connect();
            }, 1000);
        });
    }
}
