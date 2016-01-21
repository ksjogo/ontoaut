import './style.css';
import React, { Component } from 'react';
import ReactDOM  from 'react-dom';
import Remote from './Remote';
var sharedInstance = null;

export default class Ontoaut extends Component
{
    static mount(point = 'ontoautMountpoint')
    {
        ReactDOM.render(React.createElement(Ontoaut, null), document.getElementById(point));
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

    onSend(text)
    {
        text = 'fixed';
        this.remote.addJob({text: text}, console.log.bind(console));
    }

    render()
    {
        return (
            React.createElement('button', {onClick: this.onSend.bind(this), type:'button'}, 'Send!')
        );
    }
}
//Do you hear them calling out my name?
// TYPO3 might want us and is signalizing that by giving us there define
if(window && window.TYPO3define)
    window.TYPO3define('TYPO3/CMS/Annotate/OntoautLib', [], function() {
        return Ontoaut;
    });
