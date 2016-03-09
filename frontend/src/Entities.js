import React, { Component } from 'react';

export default class Result extends Component
{
    constructor(props)
    {
        super(props);
        if (this.props.type == 'unconfirmedEntities')
            this.unconfirmed = true;
    }

    confirm(subject)
    {
        return () => {
            this.props.remote.confirm(subject, () => {
                this.props.update();
            });
        };
    }

    render()
    {
        return React.createElement('div', {},
            React.createElement('table', {},
              React.createElement('tbody', {},
                React.createElement('tr', {},
                  React.createElement('th', {}, 'Label'),
                  React.createElement('th', {}, 'Subject'),
                  React.createElement('th', {}, 'Class'),
                  this.unconfirmed? React.createElement('th', {}, 'Confirm') : null
                 ),
                this.props.entities.map((ent, i) => {
                    return React.createElement('tr', {key: i},
                        React.createElement('td', {}, ent.label),
                        React.createElement('td', {}, ent.subject),
                        React.createElement('td', {}, ent.cls),
                        this.unconfirmed ? React.createElement('td', {}, React.createElement('button', {onClick: this.confirm(ent.subject), type:'button'}, 'Confirm')) : null
                       );
                }))
             )
           );
    }
}
