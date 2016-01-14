import './style.css';
import React, { Component } from 'react';
import ReactDOM  from 'react-dom';
import Remote from './Remote';
var sharedInstance = null;

export default class Ontoaut extends Component
{
    static mount(point = 'ontoaut')
    {
        ReactDOM.render(<Ontoaut />, document.getElementById(point));
    }

    // remote entry for test app
    static send(text)
    {
        sharedInstance.send(text);
    }

    constructor()
    {
        super();
        sharedInstance = this;
        this.remote = new Remote();
    }

    send(text)
    {
        this.remote.addJob({text: text}, console.log.bind(console));
    }

    render()
    {
        return (
            React.createElement('p', {}, 'Hello')
        );
    }
}
