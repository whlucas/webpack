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
        overlay: true, // 出现问题它会在浏览器弹出来一个东西提示我
        contentBase: './dist',
        // open: true, 
        proxy: {
            '/react/api': {
                // 当我请求/react/api下面的东西的时候,给他代理转发到http://www.dell-lee.com这个服务器下去请求
                target: 'http://www.dell-lee.com',
                // 并且如果你在这个路径下请求header.json这个数据的话,它就会去拿demo.json的数据
                secure: false,  // 如果要请求https的网址就要设置这个
                pathRewrite: {
                    'header.json': 'demo.json'
                },
                // 这是一个拦截,在这个路径下如果我要请求一个.html文件,我直接给你返回当前项目根路径下的/index.html,如果填false就跳过这一次请求转发
                bypass: function (req, res, proxyOptions) {
                    if (req.headers.accept.indexOf('html') !== -1) {
                        console.log('Skipping proxy for browser request.');
                        return '/index.html'; 如果填false就跳过这一次请求转发
                    }
                },
                changeOrigin: true, // 突破网站的防爬虫的限制
                // 可以自己去设置请求头
                headers: {
                    host: 'www.dell-lee.com',
                    cookie: 'sddas'
                }
            },
            // 如果是多个路径去看官网/configuration/dev-server,用context
        },
        index: '', // 如果要对根目录/实现转发就要设置这个index为空字符串或者false
        port: 8090, 
        hot: true,
        hotOnly: true,
        // historyApiFallback: true, // 配置这个解决单页面应用路由跳转失败的问题,让他每次都去访问你的那个html文件,让你的路由生效
        historyApiFallback: {
            // 他后面可以加配置
            rewrites: [
                {
                    // 如果我访问的是abc.html
                    // 那么就访问打包后目录下的index.html
                    from: /abc.html/,
                    to: '/index.html'
                },
                {
                    // 我请求libs,libs里面的东西就放到了context里面,可以在to里面写一些逻辑
                    from: /^\/libs\/.*$/,
                    to: function (context) {
                        return '/bower_components' + context.parsedUrl.pathname;
                    }
                }
            ]
        },
    }
}

// 最终导出合并后的东西
module.exports = merge(commonConfig, devConfig)