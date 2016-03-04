import Utility from './Utility';
import Api from './Api';
import $ from 'jquery-ajax';

export default class Remote
{
    constructor()
    {
        //create api methods
        for (let name in Api) {
            this[name] = function() {
                this.relay(name, Array.prototype.slice.call(arguments));
            };
        }
    }

    host(cb)
    {
        let go = () => {
            setTimeout(() => {
                cb(this.hostConfigured, this.dataTypeConfigured);
            }, 0);
        };

        if (this.hostConfigured)
        {
            go();
        }
        else if (typeof TYPO3 !== 'undefined')
        {
            this.hostConfigured = TYPO3.settings.ajaxUrls["annotate_ontoaut"];
            this.dataTypeConfigured = 'json';
            go();
        }
        else
        {
            $.ajax({url: "http://localhost:3001/status",
                    type: "HEAD",
                    timeout:1000,
                    statusCode: {
                        200: (response) => {
                            this.hostConfigured = "http://localhost:3001/";
                            this.dataTypeConfigured = 'json';
                            go();
                        },
                        400: (response) => {
                            this.hostConfigured = "http://docker:3001/";
                            this.dataTypeConfigured = 'jsonp';
                            go();
                        },
                        0: (response) => {
                            this.hostConfigured = "http://docker:3001/";
                            this.dataTypeConfigured = 'jsonp';
                            go();
                        }
                    }
                   });
        }
    }

    relay(name, args)
    {
        var cb = args.pop();
        this.host((host, dataType) => {
            $.ajax({
                type: "POST",
                url: host,
                data: JSON.stringify({name: name, args: args}),
                contentType:"application/json; charset=utf-8",
                dataType: 'json'
            }).done(function(json) {
                if (!json.success)
                    cb(json.error, null);
                else
                    cb.apply(cb, [null].concat(json.data));
            }).fail(function(jqxhr, textStatus, error) {
                cb(textStatus + error + 'in ajax transport',  null);
            });
        });
    }
}
