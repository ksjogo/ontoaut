import StoreClass from './Store';
import async from 'async';
let Store = StoreClass.instance;
import Document from './Document';

function ensureExistance(ent, cb)
{
    console.log("ensuring existance for" + ent.uri);
    return Store.stateForEntity(ent.uri, (err, cls) => {
        if (err || cls)
            return cb(err,  null);
        //unknown till now
        return Store.insertExternal(ent.uri, ent.label, cb);
    });
}

export default function work(payload, cb)
{
    let doc = new Document(payload.content);
    async.series([
        cb => {
            async.each(doc.entities, ensureExistance, cb);
        },
        cb => {
            cb();
        }
    ], cb);
}
