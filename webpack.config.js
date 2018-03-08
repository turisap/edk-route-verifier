/**
 * Created by HP on 3/8/2018.
 */
const path = require('path');

module.exports = {
    entry: './src/routeVerifier.js',
    output: {
        path: path.resolve(__dirname, 'server/static/js'),
        filename: 'edk-route-verifier.js.min'
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
    plugins: [

    ]
};