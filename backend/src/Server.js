import Express from 'express';
import Store from './Store';
import Jobs from './Jobs';
import Analyzer from './Analyzer';

export default class Server
{
    constructor()
    {
        this.app = Express();
        this.app.post('/job', this.job.bind(this));
        this.app.get('/job', this.job.bind(this));
    }

    run()
    {
        console.log("Listening on 3001");
        this.app.listen(3001);
    }

    job(req, res)
    {
        let immediate = !!req.query.immediate || false;
        let text =  {text: req.query.text};

        if (text == null || text.length <= 0)
        {
            res.status(500).jsonp({error: "No text given!"});
        }
        else if (immediate)
        {
            (new Analyzer(text)).run((err, result) => {
                res.jsonp(result);
            });
        }
        else
        {
            Jobs.instance.push(text, err => {
                res.jsonp({});
            });
        }
    }
}
