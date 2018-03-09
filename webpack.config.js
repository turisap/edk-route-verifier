/**
 * Created by HP on 3/8/2018.
 */
const path = require('path');

module.exports = (env, args) => {
    const inDevelopment = (args.mode === 'development');

    return {
        entry: './src/routeVerifier.js',
        output: {
            path: path.resolve(__dirname, 'server/static/js'),
            filename: 'edk-route-verifier.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules|tests)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        devtool:  inDevelopment ? 'eval-source-map' : 'source-map'
    }
}