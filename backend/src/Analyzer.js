import {WordTokenizer, PorterStemmer} from 'natural';

export default class Analyzer
{
    constructor(payload)
    {
        this.payload = payload;
        this.tokenizer = new WordTokenizer();
        this.stemmer = PorterStemmer;
    }

    run(cb)
    {
        console.log("Analyzing: " + this.payload);

        let error = null;
        let text = this.payload.text;
        let result = text;
        let tokenized = this.tokenizer.tokenize(text);
        let stemmed = tokenized.map(this.stemmer.stem);

        cb(error, stemmed);
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
        var a = new Analyzer({text: "Some Sentence walking around test"});
        a.run((err,  result) => {
            console.log(result);
            test.done();
        });
    }
};

export {Tests}
