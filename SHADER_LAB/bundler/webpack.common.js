const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin');

module.exports = {
  entry: {
    home: path.resolve(__dirname, '../src/home/home.js'),
    main: path.resolve(__dirname, '../src/main.js'),
  },
  plugins: [
    // STATIC COPIES
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../src/shaders'),
        to: 'shaders',
      }]
    }),
    // new CopyWebpackPlugin({
    //   patterns: [{
    //     from: path.resolve(__dirname, '../src/assets/'),
    //     to: 'img',
    //   }]
    // }),

    // PARTIALS
    new HtmlWebpackPartialsPlugin({
      path: path.resolve(__dirname, '../src/partials/header/HeaderBar.html'),
      location: 'HeaderBar',
      template_filename: ['index.html', 'app.html']
    }),

    // PAGES
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Shader Lab - Home',
      template: path.resolve(__dirname, '../src/home/home-template.html'),
      chunks: ['home'],
      minify: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'app.html',
      title: 'Shader Lab - Application',
      template: path.resolve(__dirname, '../src/templates/app-template.html'),
      chunks: ['main'],
      minify: true,
    }),
  ],
  module: {
    rules: [
      // HTML
      //   {
      //     test: /\.(html)$/,
      //     use: ['html-loader'],
      //   },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },

      // JSX
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', {'pragma': 'createElement'}]
          ]
        }
      },

      // // SHADERS
      // {
      //     test: /\.(glsl|vs|fs|vert|frag)$/,
      //     type: 'asset/resource',
      //     generator:
      //     {
      //         filename: 'assets/shaders/[name][ext]'
      //     }
      // },

      // IMAGES
      {
        test: /\.(jpg|png|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'css/img/[name].[hash][ext]',
        }
      },

      // FONTS
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'css/fonts/[name].[hash][ext]',
        }
      }
    ]
  }
}
