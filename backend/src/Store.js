import Levelup from 'levelup';
import Levelgraph from 'levelgraph';

let singleton = Symbol();

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
        this.store = Levelgraph(Levelup(path));
    }
}
