import Express from 'express';
import Store from './Store';
import Jobs from './Jobs';
import Analyzer from './Analyzer';
import Utility from './Utility';
import Api from './Api';
import BodyParser from 'body-parser';
import Cors from 'cors';

export default class Server
{
    run(port = 3001)
    {
        this.app = Express();
        this.app.use(BodyParser.json());
        this.app.use(Cors());
        this.app.post('/', this.call.bind(this));
        this.app.listen(port, () => console.log('starting server on ' + port));
    }

    call(request, response)
    {
        let {name, args} = request.body;
        if (typeof this[name] !== 'function')
        {
            response.json({success: false, error: 'invalid function name'});
        }
        else
        {
            args.push(function(){
                let [err, ...rets] = arguments;
                if (err)
                    response.json({success: false, error: err});
                else
                    response.json({success: true, data: rets});
            });
            this[name].apply(this, args);
        }
    }

    addJob(job, cb)
    {
        let {tablename, content, id, immediate = false} = job;
        // if (content == null || content.length <= 0)
        //     cb("need text to analyze",  null);
        // else if (immediate)
        //     (new Analyzer(job)).run(cb);
        // else
        //     Jobs.instance.push(job, cb);
        cb(null, "super", "yeah");
    }
};
