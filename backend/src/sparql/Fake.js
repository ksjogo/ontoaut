export default class Fake
{
    constructor()
    {
        this.sparql = require('./entities.json');
        this.sparql.results.bindings = [];
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
