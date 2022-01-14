const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(
    common,
    {
        mode: 'production',
        output:
        {
            hashFunction: 'xxhash64',
            filename: '[name].[contenthash].bundle.js',
            path: path.resolve(__dirname, '../build')
        },
        plugins:
        [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin()
        ],
        module:
        {
            rules:
            [
                // CSS
                {
                    test: /\.css$/,
                    use:
                    [
                        MiniCssExtractPlugin.loader, // 3. Extract css into files
                        "css-loader",   // 2. Turns css into commonjs
                    ]
                },

                // SASS
                {
                    test: /\.scss$/,
                    use:
                    [
                        MiniCssExtractPlugin.loader,    // 3. Extract css into files
                        'css-loader',                   // 2. Turns css into commonjs
                        'sass-loader'                   // 1. Turns sass into css
                    ]
                },
            ]
        },
    }
)
