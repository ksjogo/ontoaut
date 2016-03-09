import Levelup from 'levelup';
import Levelgraph from 'levelgraph';

var singleton = Symbol();

export default class Store
{
    static get uriState()
    {
        return {
            confirmed: 'confirmed',
            unconfirmed: 'unconfirmed',
            external: 'external'
        };
    }

    get uriState(){
        return Store.uriState;
    }

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

    v(name){
        return this.graph.v(name);
    }

    insertBase(uri, label, state, cls, cb)
    {
        let triples = [
            { subject: uri, predicate: 'state', object: state},
            { subject: uri, predicate: 'label', object: label }
        ];

        if (cls)
            triples = triples.concat({ subject: uri, predicate: 'class', object: cls });

        this.graph.put(triples, err => {
            console.log('inserted ', triples, err);
            cb(err);
        });
    }

    insertConfirmed(uri, label, cls, cb)
    {
        this.insertBase(uri, label, this.uriState.confirmed, cls, cb);
    }

    insertUnconfirmed(uri, label, cls, cb)
    {
        this.insertBase(uri, label, this.uriState.unconfirmed, cls, cb);
    }

    insertExternal(uri, label, cls, cb)
    {
        this.insertBase(uri, label, this.uriState.external, cls, cb);
    }

    entities(cb)
    {
        let s = this.v('subject');
        this.graph.search([{
            subject: s,
            predicate: 'state',
            object: this.v('state')
        }, {
            subject: s,
            predicate: 'label',
            object: this.v('label')
        }, {
            subject: s,
            predicate: 'class',
            object: this.v('cls')
        }], (err, res) => {
            console.log("ents returned: " +  res.length, err);
            cb(err, res);
        });
    }

    confirmedEntities(cb)
    {
        let s = this.v('subject');
        this.graph.search([{
            subject: s,
            predicate: 'state',
            object: this.uriState.confirmed
        },{
            subject: s,
            predicate: 'label',
            object: this.v('label')
        },{
            subject: s,
            predicate: 'class',
            object: this.v('cls')
        }], (err, res) => {
            console.log(res);
            console.log("ents returned: " + res.length, err);
            cb(err, res);
        });
    }

    stateForEntity(uri, cb)
    {
        this.graph.search([{
            subject: uri,
            predicate: 'state',
            object: this.v('state')
        }], (err, results) => {
            if (err)
                return cb(err);
            if (results.length > 0)
                return cb(null, results[0].state);
            else
                return cb(null, null);
        });
    }

    entitiesForLabel(label, cb)
    {
        this.graph.search([{
            subject: this.v('subject'),
            predicate: 'label',
            object: label
        }], (err, res) => {
            cb(err, err || (res.length > 0 && res.map(entry => entry.subject)) || null);
        });
    }
}
