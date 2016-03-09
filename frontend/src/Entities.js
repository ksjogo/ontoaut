import React, { Component } from 'react';

export default class Result extends Component
{
    render()
    {
        return React.createElement('div', {},
            React.createElement('table', {},
              React.createElement('tbody', {},
                React.createElement('tr', {},
                  React.createElement('th', {}, 'Label'),
                  React.createElement('th', {}, 'Subject'),
                  React.createElement('th', {}, 'Class')
                 ),
                this.props.entities.map((ent, i) => {
                    return React.createElement('tr', {key: i},
                        React.createElement('td', {}, ent.label),
                        React.createElement('td', {}, ent.subject),
                        React.createElement('td', {}, ent.cls)
                       );
                }))
             )
           );
    }
}
