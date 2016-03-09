import './style.css';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import ReactDOM  from 'react-dom';
import JsonTable  from 'react-json-table';
import Remote from './Remote';
import Submittor from './Submittor';
import Entities from './Entities';
var sharedInstance = null;

export default class Ontoaut extends Component
{
    get entitytypes(){
        return ['unconfirmedEntities', 'confirmedEntities', 'externalEntities'];
    }

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
            newEntry: {}
        };
        this.onUpdate();
    }

    onUpdate()
    {
        this.entitytypes.forEach(name => {
            this.remote[name]((err, ents) => {
                if (err)
                    console.log(err);
                let state = {};
                state[name] = ents || [];
                this.setState(state);
            });
        });
    }

    onNewEntryChange(name)
    {
        return event => {
            this.setState({[name]: event.target.value});
        };
    }

    onSave()
    {
        this.remote.insertConfirmed(this.state.subject, this.state.label, this.state.cls, (err, result) => {
            if (err)
                this.flash(err);
            else
                this.onUpdate();
        });
    }

    onGateReload()
    {
        this.remote.forceGateReload(console.log.bind(console));
    }

    flash(error)
    {
        alert(error);
    }

    render()
    {
        return (React.createElement('div', {},
             React.createElement(Submittor,  {remote: this.remote, update: this.onUpdate.bind(this)}),
             this.entitytypes.map(type => {
                 return React.createElement('div', {},
                     React.createElement('h1', {}, type),
                     React.createElement(Entities, {entities: this.state[type] || []})
                    );}),
             React.createElement('button', {onClick: this.onUpdate.bind(this), type:'button'}, 'Update!'),
             React.createElement('h1', {}, 'Manual'),
             ['subject', 'label', 'cls'].map((name) => {
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
            ));
    }
}

//Do you hear them calling out my name?
// TYPO3 might want us and is signalizing that by giving us their define
if(window && window.TYPO3define)
    window.TYPO3define('TYPO3/CMS/Annotate/OntoautLib', [], function() {
        return Ontoaut;
    });
