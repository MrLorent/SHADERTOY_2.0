const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
            new CleanWebpackPlugin()
        ]
    }
)
