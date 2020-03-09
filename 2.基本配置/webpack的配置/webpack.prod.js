// 这个是生产环境的打包配置

const merge = require("webpack-merge")
const commonConfig = require("./webpack.common")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin')

const prodConfig = {

    mode: 'production',
    // 这里要把eval去掉
    devtool: 'cheap-moudle-source-map',  


    // 这个就不需要了
    // devServer: {
    //     contentBase: './dist',
    //     open: true, 
    //     proxy: {
    //         '/api': 'http://localhost:3000'
    //     },
    //     port: 8090,
    //     hot: true,
    //     hotOnly: true, 
    // }


    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // 注意用了这个css分割的,就不能用原来的style-loader了
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
        // css代码分割
        // 去官网的plugin里面去找一个MiniCssExtractPlugin
        // 这个插件先现在暂时是不支持热更新的，也就是在开发环境中使用这个插件的话，就要手动刷新页面
        // 所以这个插件一般是在线上环境使用，去线上环境的配置里面去配置
        new MiniCssExtractPlugin({
            filename: '[name].css', // 如果这个css被html直接引用就会用上面的命名,
            chunkFilename: '[name].chunk.css'
        }),

        // PWA serviceWorker
        // 为了让线上的代码在服务器挂掉的时候浏览器能有缓存,这里引入这个插件
        // SW就是serviceWorker
        // 还要在index里面加一些代码
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        })
    ],

    optimization: {
        // 我要对我分割出来的css文件进行压缩,去官网找MiniCssExtractPlugin这个插件的后面介绍,在这个里面配置一个插件,给他传一个空对象
        minimizer: [
            new OptimizeCSSAssetsPlugin({})
        ],
    },
}

module.exports = merge(commonConfig, prodConfig)