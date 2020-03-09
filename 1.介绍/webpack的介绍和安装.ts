// 1.我们的import export 等等语法,默认浏览器是不认识的
// 如果在html中引用有这样语句的html文件,浏览器是不认识的
// 需要用webpack打包后生成一个新的文件,html引入新的文件浏览器才认识

// 2.他是一个模块打包工具,能把所有的模块都打包在一起,成为一个js文件


// npm init
// 一种是全局安装 npm install webpack webpack-cli 不推荐 因为全局安装会导致版本固定,如果你装的是webpack4,那么就启动不了webpack3的项目
// 所以要装到项目里面比较好 首先把全局的卸了 npm uninstall webpack webpack-cli -g
// 然后 npm install wenpack webpack-cli -D

// npx命令
// npx webpack -v 找到当前目录下安装的webpack

// npm info webpack
// 看一下webpack都有什么版本