// 把引入的第三方库代码单独打包,并把打包后的东西用一个变量暴露出去,把打包好的文件给他引入到html里面

const path = require("path")
const webpack = require("webpack")

module.exports = {
    mode: 'production',
    entry:　{
        // 起个名字,拆分打包这三个模块,也可以打包成一个
        vendors: ['lodash'],
        react: ['react', 'react-dom']
    },
    output: {
        // 打包到dll文件夹里面,起个名字,就是上面写的key值vendors
        filename: '[name].dll.js',
        path: path.resolve(__dirname, "dll"),
        library: '[name]'  // 我打包出来的东西通过一个变量暴露出去就用我起的名字vendors
    },
    plugins: [
        // 用这个插件来分析我打包的这个库,把这个库里面的映射关系放到dll/[name].manifest.json这个文件
        new webpack.DllPlugin({
            name: '[name]', // 对什么文件进行分析
            path: path.resolve(__dirname, "dll/[name].manifest.json"), // 分析后的结果放在哪
        })
    ]
}