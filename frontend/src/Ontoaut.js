import './style.css';
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import ReactDOM  from 'react-dom';
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

    constructor(props)
    {
        super(props);
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
            //this.remote[name]((err, ents) => {
            //    if (err)
            //        console.log(err);
            setImmediate(() => {
            let ents = [{label:"test", subject:"http://dkd.de/Murks", cls:"http://dkd.de/MegaMurks"}]
                let state = {};
                state[name] = ents || [];
                this.setState(state);
                
            });
            //});
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
        return (React.createElement('div', {className: 'ontoaut'},
             React.createElement(Submittor,  {remote: this.remote, update: this.onUpdate.bind(this)}),
             this.entitytypes.map(type => {
                 return React.createElement('div', {className: 'tableContainer'},
                     React.createElement('h2', {}, type),
                     React.createElement(Entities, {type: type, entities: this.state[type] || [], remote: this.remote, update: this.onUpdate.bind(this)})
                    );}),
             React.createElement('button', {onClick: this.onUpdate.bind(this), type:'button'}, 'Update!'),
             React.createElement('div', {className: 'divider'}),
             React.createElement('h2', {}, 'Manual'),
             ['Subject', 'Label', 'Class'].map((name) => {
                 return React.createElement('span', {key: name, title: name}, name,
                     React.createElement('input', {
                         type: 'text',
                         name: name,
                         value: this.state[name],
                         onChange: this.onNewEntryChange(name)
                     })
                    );
             }),
             React.createElement('div', {className: 'empty'}),                      
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
