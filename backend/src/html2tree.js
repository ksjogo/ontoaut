import Htmlparser from 'htmlparser2';
import Speech from './Speech';
import util from 'util';
import nlp from 'nlp_compromise';

export default function html2tree(input)
{
    let result = [],
        stack = [result],
        top = function() {
            return stack[stack.length - 1];
        },
        parser = new Htmlparser.Parser({
            onopentag: function(name, attribs)
            {
                let entry = [];
                entry.name = name;
                entry.attribs = attribs;
                top().push(entry);
                stack.push(entry);
            },
            ontext: function(text)
            {
                let words = Speech.tok(text);
                // words = words.map(Speech.stem);
                words = Speech.pos(words);
                for (let word of words)
                    top().push(word);
            },
            onclosetag: function(tagname)
            {
                stack.pop();
            }
        }, {decodeEntities: true});
    parser.write(input);
    parser.end();
    return result;
}

if (require.main === module) {
    let tree = (html2tree("R U Professional is a satirical electropop song by the American indie rock band the Mae Shi (pictured), inspired by a July 2008 outburst by actor Christian Bale on the set of Terminator Salvation. Bale was filming with actress Bryce Dallas Howard when he berated the director of photography, Shane Hurlbut, for walking into his line of sight. After an audio recording of the incident appeared on the website TMZ, the Mae Shi recorded their song."));
    console.log();
    console.log(util.inspect(tree,true,10));
}
