import React, { Component } from 'react';

export default class Result extends Component
{
    render()
    {
        return React.createElement('div', {}, 'Results:' ,
            React.createElement('table', {},
              React.createElement('tbody', {},
                this.props.result.map((row, i) => {
                    console.log(row);
                    return React.createElement('tr', {key: i},
                        React.createElement('td', {}, row.text),
                        React.createElement('td', {}, row.action),
                        React.createElement('td', {}, row.reason)
                       );
                }))
             )
           );
    }
}
