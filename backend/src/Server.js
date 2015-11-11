import Express from 'express';
import Store from './Store';
import Jobs from './Jobs';

export class Server
{
    constructor()
    {
        // console.log(Store.instance);
        // console.log(Jobs.instance);
        this.app = Express();
        this.app.get('/', this.hello.bind(this));
        this.app.post('/jobsAdd', this.jobsAdd.bind(this));
        this.app.get('/Jobs', this.jobs.bind(this));
    }

    run()
    {
        console.log("Listening on 3001");
        this.app.listen(3001);
    }


    hello(req, res)
    {
        res.send('hello world');
    }

    jobsAdd(req, res)
    {
        Jobs.instance.push({text: req.text}, err => {
            res.send(err ? err : 'Added Job');
        });
    }

    jobs(req, res)
    {
        res.send('hello world');
    }
}
