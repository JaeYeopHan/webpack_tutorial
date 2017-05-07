const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    context: path.join(__dirname),

    entry: ['./src/index.js'],

    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
    },

    devtool: 'eval-source-map',

    devServer: {
        hot: true,
        inline: true,
        compress: true,
        contentBase: path.join(__dirname, '/dist/'),
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
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        }]
    },

    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'commons.js',
            minChunks: Infinity
        }),
        new ExtractTextPlugin('styles.css'),
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: true,
                keepClosingSlash: true,
                removeComments: true
            }
        }),
        new webpack.EnvironmentPlugin(['NODE_ENV', 'DEBUG']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV' : JSON.stringify(process.env.NODE_ENV),
            'process.env.DEBUG' : JSON.stringify(process.env.DEBUG)
        })
    ],
};
