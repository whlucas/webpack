// 这里是共用的代码

const path = require("path")

const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const webpack = require('webpack');

const merge = require("webpack-merge")
const devConfig = require("./webpack.dev")
const prodConfig = require("./webpack.prod")

const commonConfig = {
    entry: {
        // 这个是做手动代码分割的时候用的,用插件做就不用这样了
        // lodash: './lodash.js',
        main: './index.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                }
            },

            {
                test: /\.(jpg|png|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: "images/",
                        limit: 2048,
                    }
                }
            },
            {
                test: /\.(eot|ttf|svg|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                }
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                // loader: "babel-loader",
                // 如果要使用多个loader,要用use
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    // 我加载一个js文件的时候想让他的this指向window(之前this是指向模块自身)
                    // 下载一个imports-loader,然后像下面这么配置,注意这个要写在下面,先用这个loader来处理
                    {
                        loader: 'imports-loader?this=>window'
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin(),

        // HMR在prod中是不需要的
        // new webpack.HotModuleReplacementPlugin()

        // css代码分割
        // 去官网的plugin里面去找一个MiniCssExtractPlugin
        // 这个插件先现在暂时是不支持热更新的，也就是在开发环境中使用这个插件的话，就要手动刷新页面
        // 所以这个插件一般是在线上环境使用，去线上环境的配置里面去配置
        // 不光要在这个里面new这个插件,还要在loader里面配置
        // 所以loader也要区分线上和开发环境

        // shimming垫片
        // 这是webpack自带的一个插件
        new webpack.ProvidePlugin({
            $: 'jquery',  // 如果你看到我的代码里面有$这个符号,你就给我把jquery引入了,给这个引入的jquery模块名引入叫$
            _join: ['lodash', 'join']   // 引入lodash库里面的join方法,起名叫_join
        })
    ],

    // 配置代码分割
    optimization: {
        // tree shaking
        usedExports: true,
        // 这么个配置,它就会知道把类库打包成一个文件,业务逻辑打包成一个文件
        // 在官网的插件栏中找到splitChunks
        // 这个里面的配置通用与同步和异步的代码分割
        splitChunks: {
            chunks: 'all',  // 只对异步代码进行代码分割  如果我要做同步的代码分割 把他改成all, 然后去看cacheGroups里面的配置来决定要不要分割, initial表示只对同步代码进行分割,如果只有上面的这个all,下面没有,那么就会按照默认配置进行分割,这里如果chunk的默认值是async
            minSize: 30000, // 引入模块的大小大于30000字节的话才帮你分割
            // minRemainingSize: 0,  // 这个属性加进去会报错
            maxSize: 0,  // 要分割的东西最大不能超过多少字节, 如果超过了,他看看可不可以给你拆分成多个你配置大小的文件,一般不配置这个
            minChunks: 1,  // 当一个模块至少被用了多少次的时候对他进行分割
            maxAsyncRequests: 6,  // 同时加载的模块数不超过几个,也就是webpack最多给你拆分出来五个文件在html里面引入,再多了就不给你拆了
            maxInitialRequests: 4, // 入口文件可能会引入的库最多分割成4个文件?
            automaticNameDelimiter: '~',  // 文件生成的时候单词中间会生成的连接符,在没有设置打包后文件名的时候这个会生效
            automaticNameMaxLength: 30, 
            cacheGroups: {
                // 它会检查这个引入的模块是不是从node_modules里面引入的,如果是就在前面给他加一个vendors组,后面默认是跟着的你入口文件的名字
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,  // 这个是优先级, 如果同时满足两个组,谁大哪个归哪个组
                    // 命名是如果有如果是一个组的,同步和异步的代码将会默认打包到生成同步文件名的文件里
                    // filename: 'vendors.js' // 命名:表示强行将打包后的模块都打包到vendors.js里面, 我设置这个名字在导入异步代码的时候会出错
                },
                // 这个里面是如果上面的defaultVendors这个的规则验证不通过,就走这个default里面
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,  // 如果归为这个组的模块引用了别的模块,那么这个别的模块就优先去找他原先别归为的组,而不熟在这个dufault里面重新打包
                    filename: 'common.js' // 表示如果default通了就把需要分割的模块全都打包到commin.js这个文件里面
                },
                // 再来一个组,所有的入口文件里面加载的css文件,就放到这个名为styles的文件里面去,当然这要配置了css代码分割,这里才有效
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',  // 不管是同步还是异步
                    enforce: true, // 忽略默认的参数
                },
            }
        },
        // 为了兼容老版本,这里防止如果代码没有修改两次打包出来额hash值不同的问题
        // 这里加一个配置,将业务和库代码的关系单独抽离出来形成一个文件(manifest),防止老版本在打包的时候将业务和库代码的关系代码发生变化,导致hash值变化
        runtimeChunk: {
            name: 'runtime',
        }
    },
    // performance: false,  // 需不需要提示性能上的问题
    output: {
        // publicPath: "/",
        filename: "[name].[hash].js", // 加一个hash值,为了让文件名更改,防止浏览器不重新拿文件夹只使用上次缓存的文件.但是我分离出来的库代码没有变,hash值就不会变,浏览器就还是拿缓存
        chunkFilename: '[name].[hash].chunk.js', // 间接映入的模块的文件名，就是通过直接引入的js代码去引入的js文件的文件名，比如代码分割分割出来的文件名后面会跟一个.chunk.js
        path: path.resolve(__dirname, "dist"),
    },
}

// 另外一种配置方式,需要在打包命令行里面传env的变量
// 直接 --env.production 就给这个env赋值了一个production属性,他的默认值就是true
// "build": "webpack --env.production --config webpack.prod.js"
module.exports = (env) => {
    if(env && env.production) {
        return merge(commonConfig, prodConfig);
    }else {
        // 如果没传就用dev来打包
        return merge(commonConfig, devConfig);
    }
}