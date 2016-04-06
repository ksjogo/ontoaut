import './style.css';
import React, { Component } from 'react';
import Result from './Result';
import QueryString from 'query-string';

export default class Submittor extends Component
{
    constructor(props)
    {
        super(props);
        var params =  QueryString.parse(location.search),
            input = params.passedText || '<span resource="http://dbpedia.org/resource/Berlin" vocab="http://dbpedia.org/ontology/">Berlin</span> is some city. <span resource="http://dbpedia.org/resource/Angela_Merkel" vocab="http://dbpedia.org/ontology/">Angela Merkel</span> is there.';
        this.state = {
            input: input,
            result: []
        };
    }

    onSubmit()
    {
        let input = this.state.input;
        this.props.remote.addJob({immediate: true, content: input}, (err, result) => {
            this.setState({result: JSON.parse(result) || err});
            this.props.update();
        });
    }

    onChange(event)
    {
        this.setState({input: event.target.value});
    }

    render()
    {
        return React.createElement('div', {},
            React.createElement('h2', {}, 'Submittor'),
            React.createElement('textarea', {value: this.state.input, onChange: this.onChange.bind(this)}),
            React.createElement('br', {}),
            React.createElement(Result, {result: this.state.result}),
            React.createElement('br', {}),
            React.createElement('button', {onClick: this.onSubmit.bind(this)}, 'Submit'),
            React.createElement('div', {className: 'divider'})
           );
    }
}
