export default class Fake
{
    constructor(props)
    {
        if(!props)
            props = [];
        this.sparql = require('./entity.json');
        this.sparql.results.bindings = [];
        for (let prop of props)
            this.sparql.results.bindings.push({
                "predicate": {
                    "type": "uri",
                    "value": prop.predicate
                },
                "object": {
                    "type": "uri",
                    "value": prop.object
                }});
    }
    result()
    {
        return this.sparql;
    }
}
