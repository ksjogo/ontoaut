import Levelup from 'levelup';
import Levelgraph from 'levelgraph';

export default class Store {
    constructor() {
        this.store = Levelgraph(Levelup('./db'));
    }
}
