import Htmlparser from 'htmlparser2';
import Speech from './Speech';
import util from 'util';
import nlp from 'nlp_compromise/src/index';

export default class Document
{
    constructor(html)
    {
        let rawtext = '',
            targets = [{}],
            entities = [],
            entityp = [false],
            topentityp = function() {
                return entityp[entityp.length - 1];
            },
            topentity = function(){
                return entities[entities.length - 1];
            },
            parser = new Htmlparser.Parser({
                onopentag: function(name, attribs)
                {
                    if (name == 'span' && attribs.vocab && attribs.resource)
                    {
                        entities.push({vocab: attribs.vocab, uri: attribs.resource, typeof: attribs.typeof, label: ''});
                        entityp.push(true);
                    }
                    else
                    {
                        entityp.push(topentityp());
                    }
                },
                ontext: function(text)
                {
                    if (topentityp())
                        topentity().label += text;
                    rawtext += text;
                },
                onclosetag: function(tagname)
                {
                    entityp.pop();
                }
            }, {decodeEntities: true});
        parser.write(html);
        parser.end();
        this.text = rawtext;
        this.entities = entities;
    }
}


if (require.main === module)
{
    let html = '<span resource="http://dbpedia.org/resource/Berlin" vocab="http://dbpedia.org/ontology/">Berlin</span> is some city. <span resource="http://dbpedia.org/resource/Angela_Merkel" vocab="http://dbpedia.org/ontology/">Angela Merkel</span> is stupid.';
    let doc = new Document(html);

    console.log(util.inspect(doc,true,10));
}
