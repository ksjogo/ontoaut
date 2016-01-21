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
        this.insertBase('http://dkd.de/entities/Johnny', 'Johnny', (err) => {
            this.entities((err, result) => {
                console.log(result);
            });
        });
    }

    v(name){
        return this.graph.v(name);
    }

    insertBase(uri, label, cb)
    {
        var triple1 = { subject: uri, predicate: 'class', object: 'http://dkd.de/entities/base' };
        var triple2 = { subject: uri, predicate: 'label', object: label };
        this.graph.put([triple1, triple2], cb);
    }

    entities(cb){
        this.graph.search([{
            subject: this.v('subject'),
            predicate: 'class',
            object: 'http://dkd.de/entities/base'
        },{
            subject: this.v('subject'),
            predicate: 'class',
            object: this.v('class')
        }, {
            subject: this.v('subject'),
            predicate: 'label',
            object: this.v('label')
        }], cb);
    }
}
