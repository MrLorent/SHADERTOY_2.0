const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:
    {
        main: path.resolve(__dirname, '../src/main.jsx')
    },
    plugins:
    [
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: path.resolve(__dirname, '../static') }
        //     ]
        // }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/templates/index.html'),
            minify: true
        }),
    ],
    module:
    {
        rules:
        [
            // HTML
            {
                test: /\.(html)$/,
                use:
                [
                    'html-loader'
                ]
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                [
                    'babel-loader'
                ]
            },

            // JSX
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options:
                {
                    plugins:
                    [
                        [
                            "@babel/plugin-transform-react-jsx",
                            {
                                "pragma": "createElement"
                            }
                        ]
                    ]
                }
            },

            // SHADERS
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/shaders/[name].[hash][ext]'
                }
            },

            // IMAGES
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/images/[name].[hash][ext]'
                }
            },

            // FONTS
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/fonts/[name].[hash][ext]'
                }
            }
        ]
    }
}
