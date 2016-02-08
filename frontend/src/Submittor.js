import React, { Component } from 'react';
import autobind from 'autobind-decorator';

export default class Submittor extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            input: "murks",
            result: []
        };
    }

    onSubmit()
    {
        let input = this.state.input;
        this.props.remote.addJob({immediate: true, content: input}, (err, result) => {
            this.setState({result: result || err});
        });
    }

    onChange(event)
    {
        this.setState({input: event.target.value});
    }

    render()
    {
        return React.createElement('div', {},
            React.createElement('textarea', {value: this.state.input, onChange: this.onChange.bind(this)}),
            React.createElement('br', {}),
            React.createElement('p', {}, this.state.result),
            React.createElement('br', {}),
            React.createElement('button', {onClick: this.onSubmit.bind(this)}, 'Submit')
           );
    }
}
