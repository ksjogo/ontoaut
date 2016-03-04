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

    insertUri(uri, label, state, cb)
    {
        var triple1 = { subject: uri, predicate: 'state', object: state};
        var triple2 = { subject: uri, predicate: 'label', object: label };
        this.graph.put([triple1, triple2], (err) => {
            console.log('inserted ' + uri + '  ' + state + ' ' +  err);
            cb(err);
        });
    }

    insertConfirmed(uri, label, cb)
    {
        this.insertUri(uri, label, this.uriState.confirmed, cb);
    }

    insertUnconfirmed(uri, label, cb)
    {
        this.insertUri(uri, label, this.uriState.unconfirmed, cb);
    }

    insertExternal(uri, label, cb)
    {
        this.insertUri(uri, label, this.uriState.external, cb);
    }

    entities(cb)
    {
        this.graph.search([{
            subject: this.v('subject'),
            predicate: 'state',
            object: this.v('state')
        }, {
            subject: this.v('subject'),
            predicate: 'label',
            object: this.v('label')
        }], (err, res) => {
            res.forEach((ent) => {
                ent.cls = 'http://dkd.de/base';
            });
            console.log("ents returned:", err, res);
            cb(err, res);
        });
    }

    confirmedEntities(cb)
    {
        this.graph.search([{
            subject: this.v('subject'),
            predicate: 'state',
            object: this.uriState.confirmedEntities
        }, {
            subject: this.v('subject'),
            predicate: 'label',
            object: this.v('label')
        }], (err, res) => {
            res.forEach((ent) => {
                ent.cls = 'http://dkd.de/base';
            });
            console.log("ents returned:", err, res);
            cb(err, res);
        });
    }


    stateForEntity(uri, cb)
    {
        this.graph.get({
            subject: uri
        }, (err, results) => {
            if (err)
                return cb(err);
            if (results.length > 0)
                return cb(null, results[0].state);
            else
                return cb(null, null);
        });
    }
}
