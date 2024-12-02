const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    mode: "development",
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
        historyApiFallback: true,
    },
    plugins: [new HtmlWebpackPlugin({
        template: "./index.html"
    }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/styles", to: "styles"},
                {from: "./src/static/fonts", to: "fonts"},
                {from: "./src/static/images", to: "images"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "css"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "js"},
                {from: "./node_modules/jquery/dist/jquery.min.js", to: "js"},
                {from: "./node_modules/icheck-bootstrap/icheck-bootstrap.min.css", to: "css"},
                {from: "./node_modules/bootstrap-icons/font/bootstrap-icons.min.css", to: "css"},
            ],
        }),
    ],
};