const path = require("path")

// 插件需要引入
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const webpack = require("webpack")
module.exports = {

    // 打包的环境默认是production,这个环境下代码会被压缩
    // 还有一个环境是development, 这个开发环境代码没有被压缩
    // 如果要用
    mode: 'development',

    // sourceMap
    // 当模式为开发者模式的时候这个sourceMap默认是打开的
    // 如果要关掉,写下面这行代码
    // devtool: 'none',
    // 关掉了之后
    // 1.如果代码写错了,在打包时命令行不会报错
    // 2.打包后浏览器报错时找到的错误点是在打包后的bundle.js文件里面找,而不是原来的js文件里哪个代码错了
    // 3.把sourseMap打开之后他就能帮我们找到打包前代码错误的地方
    // 打开sourseMap
    // none: 关掉
    // source-map: 打开并且生成对应的映射文件(.map)文件
    // inline-source-map: 打开把映射的文件写到打包的结果的.js文件里面去,不单独生成js文件
    // cheap-inline-source-map: 1.当我们代码很大的时候,当代吗出错的时候,我们没有加这个cheap的修饰,它会给你精确到哪一行那一列出错了,加了这个cheap,只需要告诉哪一行出错了,能相对提高打包速度2.加了这个之后他只关心业务代码,不管导入的第三方模块的映射,如果要管第三方模块的映射再加一个moudle,也就是cheap-moudle-inline-source-map
    // eval-source-map: eval他是通过eval执行js语句的方式来生成映射,和上面生成映射的方式不一样,打包效率最快,但当项目过大的时候可能会造成错误提示不准的情况
    // 最佳实践
    // dev环境: cheap-moudle-eval-source-map
    // 生产环境: 一般不需要配置这个,如果要配置cheap-module-source-map
    devtool: 'cheap-moudle-eval-source-map',  // 但是因为要构建映射关系,所以打包速度会很慢

    entry: {
        // 我现在想用通过这个入口文件打包出来两个两一样的文件
        // 那么就要对output里面配置的filename进行命名上的处理
        main: './index.js',
        sub: './index.js'
    },
    // 这种方式是对上面那种方式的简写,main表示的是入口文件的key值
    // entry: "./index.js", // 打包入口

    // 配置打包不同后缀的模块
    module: {
        rules: [
            // loader是什么
            // 就是针对一些不知道怎么打包的文件,并且引入了,应该如何打包

            // 这个file-loader可以处理所有的静态资源, 如果我想要获得这个文件的地址的话, 并且把这个文件移动到dist目录的话就用这个loader
            // 打包图片类型,他首先会把这个图片移动到dist目录下,并且把这个图片的地址作为返回值给引入赋值的那个变量
            // {
            //     test: /\.(jpg|png|svg)$/,
            //     use: {
            //         // 这里的配置不用引入这个模块
            //         loader: 'file-loader',
            //         options: {
            //             // 这种配置的语法叫做placeholder(占位符)
            //             name: '[name]_[hash].[ext]', // 打包出静态文件的名字是老图片的名字_hash值,加老图片的后缀
            //             outputPath: "images/",   // 这种类型文件打包后的位置是在images文件夹下   
            //         }
            //     }
            // },
            // 要引入.vue的文件就用这个loader
            {
                test: /\.vue$/,
                use: {
                    // 这里的配置不用引入这个模块
                    loader: 'vue-loader',
                }
            },
            // 介绍一个url-loader
            // 这个loader和file-loader作用是相同的,但是不需要改项目,只需要把loader的名字换了就可以,但是他不会在打包后的文件里面去生成这个图片,而是把这个图片以bash64的形式放到js文件里面去
            // 坏处,如果图片很大,加载js的时间就很大,阻塞页面
            // 所以小图片可以这么来,大文件需要加配置limit
            {
                test: /\.(jpg|png|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name]_[hash].[ext]',
                        outputPath: "images/",
                        limit: 2048, // 为了避免将很大的图片加载进来,这里如果超过了2kb的时候就把这个文件打包成文件,得到file-name的效果
                    }
                }
            },
            // 打包css文件
            {
                test: /\.css$/,
                // css-loader 的功能是帮我们分析出几个css文件之间的关系,相互有没有引入,给他合并成一个css文件,把这个文件给style-loader,这个style-loader帮我们挂在好html里面的header标签里面
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            // 打包less,sass这样的文件
            {
                test: /\.scss$/,
                // 注意用sass-loader前最去webpack官网看一下
                // 他这里不光要安装sass-loader还要安装node-sass

                // 我们在写transform这样的css属性的时候希望他帮我加上厂商前缀
                // 用postCss-loader,去官网看一下,他让我加一个配置文件postcss.config.js
                // 在写配置文件的时候还要用autoprefixer,安装一下,这个autoprefixer就是为了给我们的某些css3的属性加上厂商的前缀
                use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                // 如果我我处理的那个sass文件中还引入了其他的sass文件
                                // 那么这些个文件都要再去走前面的两个loader
                                // 2代表前面的两个loader
                                importLoaders: 2,
                                // 开启css的模块化打包,这样的话css的引入方式就不能像之前那样全局引入了import "./src/index.scss"
                                // 要这样引入
                                // modules: true,
                            }
                        },
                        'sass-loader', 
                        'postcss-loader'
                    ]
            },
            
            // 打包字体文件,只需要利用file-loader把这些字体文件打包到指定的路径下,让dist目录下的css能找到就好了
            {
                test: /\.(eot|ttf|svg|woff|woff2)$/,
                use: {
                    loader: 'file-loader',
                    // 这里不用指定文件夹,和文件名,不知道为啥他就能找到
                }
            },

            // 解析es6
            // 去bable官网找到设置-webpack
            // 他让我安装babel-loader @babel/core
            // 还要安装@babel/preset-env,因为babel-loader是帮我们链接babel和webpack,还要借助这个模块来帮我翻译成es5的语法
            // 还要去babel官网的doc里面去找polyfill,安装一下,这个是用来翻译那些es6中特有的函数的
            // 安装之后在根目录js中去import "@babel/polyfill";它会帮你去实现那些es6里面没有的东西,加了useBuiltIns: 'usage'就不用去import "@babel/polyfill了
            {
                test: /\.js$/,
                exclude: /node_modules/, // 被转义的代码不包括第三方模块
                loader: "babel-loader",
                // 做一个配置把@babel/preset-env这个包配置进去

                // 这个options:后面的对象可以单独放到.babelrc文件夹里面,这个options就可以全都不写了
                // options:{
                //     // 为了让@babel/polyfill不要去引入太多不必要的东西
                //     // 需要在这给@babel/preset-env加上配置,先把他放到数组里面,然后在第二项上面写配置
                //     // presets: [['@babel/preset-env', {
                //     //     // 他表示我去做@babel/polyfill填充的时候,不要全部都填进来,按需加载
                //     //     // 加了这个就不用去import "@babel/polyfill了
                //     //     useBuiltIns: 'usage',
                //     //     corejs: "2", // 写上面的那一个配置,就要写我这个的配置
                //     //     targets: {
                //     //         chrome: "67"  // 我这个项目是运行在大于67版本的chrome浏览器的,我希望依据按照这个浏览器版本来进行es6代码的编译
                //     //     }
                //     // }]],
                //     // 如果写业务代码,用上面的方式来打包
                //     // 如果我要写库文件,那么用下面的方式,因为上面的方式会给你引入import "@babel/polyfill,会对全局变量进行污染,下面这种方式不会污染
                //     // 去官网的doc去找transform-runtime
                //     // npm install --save-dev @babel/plugin-transform-runtime
                //     // npm install --save @babel/runtime
                //     "plugins": [["@babel/plugin-transform-runtime", {
                //         "absoluteRuntime": false,
                //         "corejs": 2,  // 这里写哪个就要去装哪个包,去官网的transform-runtime下面搜关键字corejs这里安装npm install --save @babel/runtime-corejs2
                //         "helpers": true,
                //         "regenerator": true,
                //         "useESModules": false,
                //         "version": "7.0.0-beta.0"
                //     }]],
                // }
            }
        ]
    },

    // 插件的作用,他可以在webpack运行到某一个时候的时候帮我们去做一些事情
    plugins: [
        // 这个插件能帮我们再dist目录下依据你指定的模板创建一个html,并且帮我们把打包后的js引入这个他创建的html文件
        // 这个插件是在打包之后运行的
        new HtmlWebpackPlugin({
            // 以哪一个html模板去在dist目录下去创建html
            template: './src/index.html'
        }),
        // 这个插件帮我们在打包之前把上一次打包的文件夹删了,注意引入的时候要解构的方式引入
        new CleanWebpackPlugin(),

        // 在插件里面加上热模块更新(HMR)的插件
        // 然后再devServer里面配置一下
        new webpack.HotModuleReplacementPlugin()
    ],


    output: {   // 打包出口
        // filename: "bundle.js",  // 打包后的文件名

        // 所有的打包出来的文件互相的引用前面都加一个根路径
        // 确保不会出错
        publicPath: "/",

        // 这里我想要打包出来多个文件,用占位符处理
        // name只的是entry中配置的key值
        // 也就是entry里面有几个key这里就有几个打包后的结果文件
        filename: "[name].js",  // 打包后的文件名

        // 打包后的文件放在哪个文件夹下,这里必须要传一个绝对路径bundle是文件名
        path: path.resolve(__dirname, "dist") ,

        // 我希望我的插件帮我引入到html里面的script标签上的src属性的时候,前面就带一些网址网址,因为我的前端文件是要传到cdn上面的,但是不希望文件名上面有地址
        // publicPath: 'http://cdn/com.cn'
    },

    // devServer的配置
    // webpack-dev-server它会帮我们把打包好的文件放内存里面去,不会生成出来以提高打包速度
    // 之前的直接运行html文件,他的路径是文件路径,没法发ajax请求
    // 现在是用服务器的形式打开,就可以在js里面发ajax请求了
    devServer: {
        // 这个是配置服务器启动的根目录
        contentBase: './dist',
        open: true, // 会自动的帮你打开浏览器,访问你的端口
        // 设置代理
        // react和vue底层支持了webpack-dev-server,所以他们也可以配置代理
        proxy: {
            // 如果请求路径是/api的,则会帮我们转发到http://loaclhost: 3000
            '/api': 'http://localhost:3000'
        },
        port: 8090, // 默认打开的端口

        // HMR(热模块更新)的使用
        // HMR当我改变样式的时候你不要给我重新刷新浏览器了,刷新了我之前创建的dom就不在了,直接给我变样式就可以了
        // 还有一个好处是当我们改变某一个模块里面的代码,不希望他去影响别的模块的代码,但是要在js里面加一个js的语句if(moudle.hot){}
        // 让我们的webpack-dev-server去开启热模块更新
        // 还要在插件里面加上热模块更新的插件
        hot: true,
        hotOnly: true, // 及时hot的功能没有生效,浏览器也不要刷新
    }
}