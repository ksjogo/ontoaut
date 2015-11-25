export default class Analyzer
{
    constructor(payload)
    {
        this.payload = payload;
    }

    run(cb)
    {
        let error = null;
        let result = this.payload.text;
        console.log("Analyzing: " + this.payload);
        cb(error, result);
    }
}
