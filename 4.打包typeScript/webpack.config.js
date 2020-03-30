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

    // 如果里面有ts代码,则必须要加这个,在解析模块的时候让他不光去找js文件,还要去找ts文件
    // 否则ts文件加载不进来
    resolve: {
        extensions: [".ts", ".js"]
    },

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
}