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

export default class Analyzer
{
    get tokenizer()
    {
        return defaultTokenizer;
    }

    get stemmer()
    {
        return defaultStemmer;
    }

    get tagger()
    {
        return defaultPosTagger;
    }

    constructor(payload)
    {
        console.log(payload);
        // wait until pos tagger is initialized
        while(!posInited)
            deasync.sleep(10);
        this.payload = payload;
    }

    run(cb)
    {
        console.log("Analyzing: " + this.payload);

        let error = null;
        let text = this.payload.text;
        let result = text;
        console.log(text);
        let tokenized = this.tokenizer.tokenize(text);
        let stemmed = tokenized.map(this.stemmer.stem);
        let posed = this.tagger.tag(stemmed);

        cb(error, posed);
    }
}

var Tests = {
    testPayload: function (test)
    {
        var a = new Analyzer({text: "test"});
        test.ok(!!a.payload.text);
        test.done();
    },

    testRun: function (test)
    {
        var a = new Analyzer({text: "Johnny is walking into the house."});
        a.run((err,  result) => {
            console.log(result);
            test.ok(true);
            test.done();
        });
    }
};

export {Tests}
