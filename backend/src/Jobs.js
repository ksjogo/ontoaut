import Levelup from 'levelup';
import LevelJobs from 'level-jobs';

let singleton = Symbol();

export default class Jobs
{
    static get instance()
    {
        if (!this[singleton])
        {
            this[singleton] = new Jobs('./data/jobs');
        }
        return this[singleton];
    }

    constructor(path)
    {
        this.queue = LevelJobs(Levelup(path), this.worker.bind(this));
    }

    worker(payload, cb)
    {

    }
}
