const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ip = require('internal-ip');
const portFinderSync = require('portfinder-sync');

const infoColor = (_message) =>
{
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(
    common,
    {
        mode: 'development',
        devtool: 'source-map',
        stats: 'errors-warnings',
        devServer:
        {
            host: 'local-ip',
            port: portFinderSync.getPort(8000),
            open: true,
            https: false,
            allowedHosts: 'all',
            hot: false,
            watchFiles: ['src/**', 'static/**'],
            static:
            {
                watch: true,
                directory: path.join(__dirname, '../static')
            },
            client:
            {
                logging: 'none',
                overlay: true,
                progress: false
            },
            onAfterSetupMiddleware: function(devServer)
            {
                const port = devServer.options.port
                const https = devServer.options.https ? 's' : ''
                const localIp = ip.v4.sync()
                const domain1 = `http${https}://${localIp}:${port}`
                const domain2 = `http${https}://localhost:${port}`
                
                console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)
            }
        },
        module:
        {
            rules:
            [
                // CSS
                {
                    test: /\.css$/,
                    use:
                    [
                        "style-loader", // 3. Extract css into files
                        "css-loader",   // 2. Turns css into commonjs
                    ]
                },

                // SCSS
                {
                    test: /\.scss$/,
                    use:
                    [
                        "style-loader", // 3. Extract css into files
                        "css-loader",   // 2. Turns css into commonjs
                        "sass-loader"   // 1. Turns sass into css
                    ]
                }
            ]
        },

    }
)
