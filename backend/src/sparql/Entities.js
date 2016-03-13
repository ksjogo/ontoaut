export default class Fake
{
    constructor(entities)
    {
        this.sparql = require('./entities.json');
        this.sparql.results.bindings = [];
        for (let ent of entities)
        {
            let {subject, cls, label} = ent;
            this.add(label, subject, cls);
        }
    }

    add(name, thing, cls)
    {
        this.sparql.results.bindings.push({
            "Name" : {
                "type" : "literal",
                "value" : name
            },
            "Thing" : {
                "type" : "uri",
                "value" : thing
            },
            "Cls" : {
                "type" : "uri",
                "value" : cls
            }
        });
    }

    result()
    {
        return this.sparql;
    }
}
