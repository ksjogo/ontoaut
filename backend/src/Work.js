import StoreClass from './Store';
import async from 'async';
let Store = null;
if (!(require.main === module))
{
    Store = StoreClass.instance;
}
import parse from './parse';
import Nlp from 'nlp_compromise/src/index';
import Noun from 'nlp_compromise/src/term/noun/noun';
import Organisation from 'nlp_compromise/src/term/noun/organisation/organisation';
import Person from 'nlp_compromise/src/term/noun/person/person';
import Place from 'nlp_compromise/src/term/noun/place/place';
import Wordnet from 'node-wordnet';

var base = 'http://dkd.de/ontoaut/';

export default function work(payload, cb)
{
    let {text, entities}= parse(payload.content);

    async.map(entities, ensureExistance, (err, externals = [])=> {
        let sentences = Nlp.text(text).sentences;
        // extract all terms from the given text, and call terminator on them
        async.map([].concat.apply([], sentences.map(sentence => sentence.terms)), terminator, (err, results) => {
            cb(err, JSON.stringify(externals.concat(results)));
        });
    });
}

function externalExistance(uri, cb)
{
    cb(null, {text: uri, action: 'external', reason: 'existing'});
}

function externalized(uri, cb)
{
    cb(null, {text: uri, action: 'external', reason: 'added'});
}

function ensureExistance(ent, cb)
{
    Store.stateForEntity(ent.uri, (err, cls) => {
        if (err)
            cb(err);
        else if (cls)
            externalExistance(ent.uri, cb);
        else
            Store.insertExternal(ent.uri, ent.label, base + 'External', err => {
                if (err)
                    cb(err);
                else
                    externalized(ent.uri, cb);
            });
    });
}

function stripExclamationPointSigns(label)
{
    return (label.slice(-1).match(/!|\.|\?|,/)) ? label.slice(0, -1) : label;
}


function dropped(term, reason, cb)
{
    cb(null, {text: term.text, action: 'dropped', reason: reason});
}

function added(term, reason, cb)
{
    cb(null, {text: term.text, action: 'added', reason: reason});
}

function terminator(term, cb)
{
    let label = stripExclamationPointSigns(term.text);
    // no nouns get kicked out
    if (!(term instanceof Noun))
        dropped(term, term.tag, cb);
    else Store.entitiesForLabel(label, (err, ents) => {
        if (ents)
            dropped(term, 'known entity', cb);
        else (new Wordnet()).lookup(label, result => {
            if (result.length > 0)
                dropped(term, 'wordnetted noun', cb);
            else
                emerger(term, cb);
        });
    });
}

function emerger(term, cb)
{
    let label = stripExclamationPointSigns(term.text),
        type = term.tag != 'Noun' ? term.tag : 'Thing',
        cls = base + type,
        uri = base + label.replace(/ /g, '_');
    if (type == 'Value' || type == 'Pronoun')
        dropped(term, term.tag, cb);
    else
        Store.insertUnconfirmed(uri, label, cls, (err, result) => {
            if (err)
                cb(err);
            else
                added(term, type, cb);
        });
}

if (require.main === module)
{
}
