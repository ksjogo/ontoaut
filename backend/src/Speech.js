import {
    WordTokenizer,
    PorterStemmer,
    BrillPOSTagger
} from 'natural';

var defaultTokenizer = new WordTokenizer(),
    defaultStemmer = PorterStemmer,
    path = require('path'),
    deasync = require('deasync'),
    posBase = path.normalize(path.join(__dirname, '../node_modules/natural/lib/natural/brill_pos_tagger')),
    posRules =  path.join(posBase, 'data/English/tr_from_posjs.txt'),
    posLexicon = path.join(posBase, 'data/English/lexicon_from_posjs.json'),
    posDefault =  'N',
    posInited = false,
    posCb = function(err){
        if (err)
            throw err;
        posInited = true;
    },
    defaultPosTagger = new BrillPOSTagger(posLexicon, posRules,  posDefault,  posCb);

function tok(string)
{
    return defaultTokenizer.tokenize(string);
}

function stem(words)
{
    return defaultStemmer.stem(words);
}

function pos(words)
{
    while(!posInited)
        deasync.sleep(10);
    return defaultPosTagger.tag(words);
}

export default{
    pos,
    stem,
    tok
};
