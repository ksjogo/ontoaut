import Levelup from 'levelup';
import Levelgraph from 'levelgraph';

var singleton = Symbol();

export default class Store
{
    static get instance()
    {
        if (!this[singleton])
        {
            this[singleton] = new Store('./data/graph');
        }
        return this[singleton];
    }

    constructor(path)
    {
        this.graph = new Levelgraph(Levelup(path));
    }
}
