module.exports =  {
    module:  {
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: "style!css"
            },
            ,
            {
                test: /\.json$/,
                loader: "json"
            }
        ]
    }
};
