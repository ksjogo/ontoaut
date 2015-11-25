import Levelup from 'levelup';
import LevelJobs from 'level-jobs';
import Analyzer from './Analyzer';

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

    worker(payload, cb)
    {
        console.log("Working: " + payload);
        let ana = new Analyzer(payload);
        ana.run((err, result) => {
            if (err)
                console.log("Failed: " + payload);
            else
                console.log("Finished: " + payload);
            cb();
        });
    }

    push(payload, cb)
    {
        this.queue.push(payload, cb);
    }
}
