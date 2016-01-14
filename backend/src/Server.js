import Express from 'express';
import Store from './Store';
import Jobs from './Jobs';
import Analyzer from './Analyzer';
import Utility from './Utility';
import http from 'http';
import muxrpc from 'muxrpc';
import pull from 'pull-stream';
import ws from 'ws';
import pullWs from 'pull-ws';
import fs from 'fs';
import Api from './Api';

export default class Server
{
    // create a commandStream for each websocket connection
    get commandStream()
    {
        var muxrpcinstance = muxrpc(null, Api) (this);
        return muxrpcinstance.createStream();
    }

    // run server and server command websockets
    run()
    {
        console.log('starting server on 3001');
        this.socketServer = new ws.Server({port: 3001, origin: '*'});
        this.socketServer.on('connection',  socket => {
            console.log("on connection");
            var transportStream = pullWs(socket);
            var commandStream = this.commandStream;
            pull(commandStream, transportStream, commandStream);
        });
    }

    addJob(job, cb)
    {
        console.log("AddJob:");
        console.log(job);
        if (job.text == null || job.text.length <= 0)
            cb("job needs text",  null);
        else if (job.immediate)
            (new Analyzer(job)).run(cb);
        else
            Jobs.instance.push(job, cb);
    }
};
