const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    externals: ['lodash'], // 如果我的这个库里面用到了lodash,防止我这个里面打包了lodash,别人用我的库,且别人本身引入了lodash,就会代码冗余,所以我这里把这个lodash库再打包的时候删掉,让别人用的库的时候先去自己引用lodash
    // 还可以这么写
    // externals: {
    //     // 要求加载lodash的时候需要按照要求加载
    //     lodash: {
    //         commonjs: '_', // 如果我的这个lodash是通过script标签引入的,那么就必须在全局注入一个全局变量_
    //         commonjs: 'lodash', // 如果我的库在commonjs环境下被引入,那么命名变量名必须是lodash
    //     }
    // },
    // // 但是一把如果是对象的话都这么写
    // externals: {
    //     // 表示不管什么情况下引入lodash,都要起名为lodash
    //     lodash: 'lodash'
    // },
    // externals: 'lodash',  // 这么写和上面好像是一样的
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'library.js',
        libraryTarget: 'umd',   // 打包库代码的时候,加上这个,代表外部如果安装了我的库,不管是用任何方式来应用我的库,我都支持
        library: 'library',  // 我还支持你引入我的这个文件之后,可以直接library.我里面暴露的方法,就配置这个参数,参数值就是命名的全局变量的名字

        // library: 'library',
        // libraryTarget: 'this', // 但是如果不写umd,写一个this,就和上面的那个配合起来了,就是把上面的那个全局变量library放到this里面,这个还可以填window,node环境下可以写global,但一般还是写umd, library那里写root
         
    }
}


// 如何最终发布到npm上

// 1.把这个项目的package.json里面的main文件改成你dist目录下打包生成的最后的js文件,这里是library.js
// 2.去www.npmjs.com注册一下,登录
// 3.然后在命令行输入npm adduser 输入用户名密码
// 4.然后命令行输入npm publish  库的名字就是package.json里面的name后面的值,然后author后面的值,license后面的值都要看一下些什么lichense可以写MIT,表示开源