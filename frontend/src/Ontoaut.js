import './style.css';
import React, { Component } from 'react';
import ReactDOM  from 'react-dom';
import Connector from './Connector';
var sharedInstance = null;

export default class Ontoaut extends Component
{
    static mount(point = 'ontoaut')
    {
        ReactDOM.render(<Ontoaut />, document.getElementById(point));
    }


    constructor()
    {
        super();
        sharedInstance = this;
        this.connector = new Connector();
        this.connector.connect();
    }

    // remote entry for test app
    static send(text)
    {
        sharedInstance.send(text);
    }

    send(text)
    {
        this.connector.addJob({text: text}, console.log.bind(console));
    }

    render()
    {
        return (
            React.createElement('p', {}, 'Hello')
        );
    }
}
