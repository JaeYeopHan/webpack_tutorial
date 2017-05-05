const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: path.join(__dirname, 'src'),
            use: [{
                loader: 'babel-loader',
            }]
        }, {
            test: /\.css$/,
            use: [
                'style-loader', 'css-loader'
            ]
        }]
    }
};
