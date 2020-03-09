// node环境下使用webpack

// 只要执行这个文件就是用你传进来的配置来打包指定的东西
// 并且能够监听文件的变化,但是不能帮你自动刷新浏览器

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config');

// 返回一个编译器,这个编译器可以用来编译东西
// node里面调webpack可以去node的官方文档里面去查
const complier = webpack(config)

const app = express()

// 在中间键里面把这个编译器放进去,让他去执行
// 参数传一个publicPath
// 只要文件发生改变,这个中间键就会重新运行
app.use(webpackDevMiddleware(complier, {
    publicPath: config.output.publicPath
}))

qpp.listen(3000, () => {
    console.log('server is running')
})