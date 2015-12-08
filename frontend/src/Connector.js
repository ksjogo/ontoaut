export default class Connector {
    constructor(host = 'http://localhost:3001/')
    {
        this.host = host;
        console.log('Connecting to ' +  host);
    }
}
