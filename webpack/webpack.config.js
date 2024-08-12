const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'js'),
        filename: 'scripts.js'
    },
    module: {
        rules: [
            loaders, [{
                loader: 'babel',
                exclude: /node_modules/
            }]
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Ricerca Libri',
            template: './src/index.html'
        })
    ],
    devServer: {
        port: 5000,
        open: true,
        static: path.resolve(__dirname, 'js')
    },
    mode: 'production'
}