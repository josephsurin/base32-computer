const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const rxPaths = require('rxjs/_esm5/path-mapping')

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/build/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(sa|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [{ loader: 'file-loader', options: {} }]
            }
        ]
    },
    resolve: {
        extensions: [' ', '.js', 'jsx'],
        alias: rxPaths()
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'bundle.css',
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
}

