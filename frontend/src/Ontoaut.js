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

    static send(text)
    {
        sharedInstance.send(text);
    }

    constructor()
    {
        super();
        sharedInstance = this;
        this.connector = new Connector();
    }

    send(text)
    {
        console.log('innersend');
    }

    render()
    {
        return (
            React.createElement('p', {}, 'Hello')
        );
    }
}
