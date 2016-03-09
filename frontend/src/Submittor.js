import React, { Component } from 'react';
import Result from './Result';

export default class Submittor extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            input: '<span resource="http://dbpedia.org/resource/Berlin" vocab="http://dbpedia.org/ontology/">Berlin</span> is some city. <span resource="http://dbpedia.org/resource/Angela_Merkel" vocab="http://dbpedia.org/ontology/">Angela Merkel</span> is stupid.',
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
            React.createElement('h1', {}, 'Submittor'),
            React.createElement('textarea', {value: this.state.input, onChange: this.onChange.bind(this)}),
            React.createElement('br', {}),
            React.createElement(Result, {result: this.state.result}),
            React.createElement('br', {}),
            React.createElement('button', {onClick: this.onSubmit.bind(this)}, 'Submit')
           );
    }
}
