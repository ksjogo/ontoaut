import Express from 'express';
import Store from './Store';

export class Server {
    constructor() {
        this.store = new Store();
        this.app = Express();
        this.app.get('/', function(req, res){
            res.send('hello world');
        });
    }

    run(){
        console.log("Listening on 3001");
        this.app.listen(3001);
    }
}
