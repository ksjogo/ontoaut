import './style.css';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import ReactDOM  from 'react-dom';
import JsonTable  from 'react-json-table';
import Remote from './Remote';
import Submittor from './Submittor';
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
        this.state = {
            displayedEntities: null,
            newEntry: {}
        };
        this.onUpdate();
    }

    onUpdate()
    {
        this.remote.entities((ent) => {
            this.setState({displayedEntities: ent});
        });
    }

    onNewEntryChange(name)
    {
        return (event) => {
            var n = {};
            n[name] = event.target.value;
            this.setState(n);
        };
    }

    onSave()
    {
        this.remote.insertBase(this.state.subject, this.state.label, (err, result) => {
            this.onUpdate();
        });
    }

    onGateReload()
    {
        this.remote.forceGateReload(console.log.bind(console));
    }

    render()
    {
        return (React.createElement('div', {},
             // active entities
             React.createElement(Submittor,  {remote: this.remote}),
             React.createElement(JsonTable, {rows: this.state.displayedEntities, columns: ['subject', 'cls', 'label']}),
             React.createElement('button', {onClick: this.onUpdate.bind(this), type:'button'}, 'Update!'),
             React.createElement('br', {}),
             // edit form
             ['subject', 'label'].map((name) => {
                 return React.createElement('span',{key: name, title: name}, name, ':',
                     React.createElement('input', {
                         type: 'text',
                         name: name,
                         value: this.state[name],
                         onChange: this.onNewEntryChange(name)
                     })
                    );
             }),
             React.createElement('button', {onClick: this.onSave.bind(this), type:'button'}, 'Save!'),
             React.createElement('button', {onClick: this.onGateReload.bind(this), type:'button'}, 'GATE Reload!')
             //
            ));
    }
}


//Do you hear them calling out my name?
// TYPO3 might want us and is signalizing that by giving us there define
if(window && window.TYPO3define)
    window.TYPO3define('TYPO3/CMS/Annotate/OntoautLib', [], function() {
        return Ontoaut;
    });
