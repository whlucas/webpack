// 这个是开发模式的打包配置
// 用webpack-merge来合并webpack文件

const merge = require("webpack-merge")
const commonConfig = require("./webpack.common")
const webpack = require("webpack")

// 这里把modele.export放到下面去
// 这里给他换一个对象赋值
const devConfig = {

    mode: 'development',

    devtool: 'cheap-moudle-eval-source-map', 
    
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        }
                    },
                    'sass-loader',
                    'postcss-loader'
                ]
            },
        ]
    },

    plugins: [
        // dev中有个特有的插件,要把他留下
        new webpack.HotModuleReplacementPlugin()
    ],

    optimization: {
        usedExports: true  
    },

    devServer: {
        contentBase: './dist',
        // open: true, 
        proxy: {
            '/api': 'http://localhost:3000'
        },
        port: 8090, 

        hot: true,
        hotOnly: true, 
    }
}

// 最终导出合并后的东西
module.exports = merge(commonConfig, devConfig)