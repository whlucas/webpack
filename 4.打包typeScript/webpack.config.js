// 首先要在根目录里面建一个tsconfig.json

const path = require('path')

module.exports = {
    entry: './src/index.tsx',
    mode: 'production',

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}