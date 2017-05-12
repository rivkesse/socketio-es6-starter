var webpack = require('webpack');
var path = require('path');

const entries = {
    client: './src/client/js/client.js'
};

module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'dist', 'js'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader'
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};