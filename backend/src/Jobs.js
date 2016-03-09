import Levelup from 'levelup';
import LevelJobs from 'level-jobs';
import util from 'util';
import work from './Work';

var singleton = Symbol();

export default class Jobs
{
    static get instance()
    {
        if (!this[singleton])
            this[singleton] = new Jobs('./data/jobs');
        return this[singleton];
    }

    constructor(path)
    {
        this.queue = new LevelJobs(Levelup(path), this.worker.bind(this));
    }

    push(payload, cb)
    {
        this.queue.push(payload, err => {
            if (err)
                console.log("Failed to add job:" + err);
            else
                cb (null,  {result: "job added"});
        });
    }

    worker(payload, cb)
    {
        work(payload, cb);
    }
}
