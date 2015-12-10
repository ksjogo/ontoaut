import Express from 'express';
import Store from './Store';
import Jobs from './Jobs';
import Analyzer from './Analyzer';
import Utility from './Utility';
import http from 'http';
import shoe from 'shoe';
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
        this.socketServer = new ws.Server({port: 3001, origin: '*'});
        this.socketServer.on('connection',  socket => {
            console.log("on connection");
            var transportStream = pullWs(socket);
            var commandStream = this.commandStream;
            pull(commandStream, transportStream, commandStream);
        });
    }

    hello(name, cb)
    {
        cb(null, 'hello, ' + name + '!');
    }

    stuff (arg)
    {
        return pull.values([arg, 1, 2, 3, 4, 5]);
    }


    job(req, res)
    {
        let immediate = !!req.query.immediate || false;
        let job =  {text:req.query.text};

        if (job.text == null || job.text.length <= 0)
        {
            res.status(500).jsonp({error: 'No text given!'});
        }
        else if (immediate)
        {
            (new Analyzer(job)).run((err, result) => {
                res.jsonp(result);
            });
        }
        else
        {
            Jobs.instance.push(job, err => {
                res.jsonp({});
            });
        }
    }
};
