import Express from 'express';
import Store from './Store';
import Jobs from './Jobs';
import Utility from './Utility';
import Api from './Api';
import BodyParser from 'body-parser';
import Cors from 'cors';
import SparqlEntities from './sparql/Entities';
import SparqlEntity from './sparql/Entity';
import Request from 'request';

export default class Server
{
    run(port = 3001)
    {
        this.app = Express();
        this.app.use(Cors());
        this.app.post('/', BodyParser.json(), this.call.bind(this));
        this.app.post('/repository/sparql', BodyParser.urlencoded({extended: false}), this.entities.bind(this));
        this.app.get('/repository/sparql', BodyParser.urlencoded({extended: false}), this.entities.bind(this));
        this.app.get('/repository/entity/:uri', this.entity.bind(this));
        this.app.get('/status', BodyParser.urlencoded({extended: false}), this.status.bind(this));
        this.app.listen(port, () => console.log('starting server on ' + port));
        this.store = Store.instance;
    }

    call(request, response)
    {
        let {name, args} = request.body;
        console.log('remote call', name, args);
        if (Api[name] === undefined)
            return response.json({success: false, error: 'client error: function undefined: ' + name});

        let target = Api[name] ? this[Api[name]] : this;
        if (typeof target[name] !== 'function' || target[name] == null)
            return response.json({success: false, error: 'server error: invalid function name: ' + name});

        args.push(function(){
            let [err, ...rets] = arguments;
            if (err)
                response.json({success: false, error: err});
            else
                response.json({success: true, data: rets});
        });
        return target[name].apply(target, args);
    }

    status(request, response)
    {
        response.json("online");
    }

    // we return all extracted entites in a matching format
    // the LKB Gazetter is actually sending proper SparQL
    // but we do not care about this for the moment
    entities(request, response)
    {
        this.store.confirmedEntities((err, ents) => {
            var sparqlized = new SparqlEntities(ents);
            response.json(sparqlized.result());
        });
    }

    entity(request, response)
    {
        let ent = 'http://dkd.de/ontoaut/' + request.params.uri;
        console.log(ent);
        this.store.entity(ent, (err, props) => {
            console.log(err, props);
            var sparqlized = new SparqlEntity(props);
            response.json(sparqlized.result());
        });
    }

    addJob(job, cb)
    {
        let {tablename, id, content, immediate = false} = job;
        if (content == null || content.length <= 0)
            cb("need text to analyze",  null);
        else if (immediate)
            Jobs.instance.worker(job, cb);
        else
            Jobs.instance.push(job, cb);
    }

    forceGateReload(cb)
    {
        Request({url: 'http://tomcat:tomcat@gate:8089/manager/text/reload?path=/gate'}, (error, response, body) => {
            console.log(body);
            cb("ok");
        });
    }

};
