// // es6模块化打包要引入这个,来翻译那些es6才有的函数和对象
// // 配置里加了useBuiltIns: 'usage'就不用去import "@babel/polyfill了
// // import "@babel/polyfill";

// import jpg from "./src/qianming.jpg" // 这个后缀要写
// import "./src/index.scss" // 全局引入,这个里面的样式将影响这个js文件创建的所有dom
// // import style from "./src/index.scss"


// import "./src/index.css"

// let img = new Image();
// img.src = jpg
// img.classList.add("style.avatar") // 这样这个acatar样式只对这个img起作用

// let root = document.getElementById("root")
// root.append(img)

// // 导入字体文件
// // iconfont这个网站,新建一个项目去图标库里面随表找几个图标,添加至项目,然后去项目里面下载至本地,下载的文件夹里面找到.eot .svg .ttf. .woff 这四个放到src里面的font文件夹里面

// // 然后把里面的iconfont.css文件里面的东西复制出来放到我的这个index.scss文件夹里面
// // 然后修改这个css文件里面的所有的路径
// // 然后在最下面它会给你提供对应的class名,注意这个div里面不能有内容,要不然不好使
// root.innerHTML = "<div class='iconfont iconauto'></div>"

// var btn = document.createElement('button');
// btn.innerHTML = '新增';
// document.body.appendChild(btn);

// btn.onclick = function() {
//     var div = document.createElement('div');
//     div.innerHTML = 'item';
//     document.body.appendChild(div)
// }



// // 加了热模块更新之后
// // 如果有两个模块
// // 我希望其中一个模块变了不要去影响另外一个模块


// // if (moudle.hot) {
// //     // 也就是当./number文件里的东西变化了,我就执行后面的函数
// //     module.hot.accept('./number', () => {
// //         // 一般都是把之前的操作要清除掉
// //         // 然后重新执行一下函数
// //     })
// // }


// // 但为什么我引入css模块的时候,就不用我写这么一坨,他就会帮我们监听到css文件的变化,不改变其他模块只重新渲染css
// // 因为这一坨在css-loader里面它帮我写了

// // vue-loader react 他都帮你写好了,不用你自己写,
// // 但引入一些其他东西就得自己写这一坨



// // es6
// const arr = [
//     new Promise(() => {}),
//     new Promise(() => {})
// ]

// 打包react代码
// 也是在.babelrc里面配置
// import React, { Component } from 'react'
// import ReactDom from 'react-dom'
// class App extends Component {
//     render() {
//         return <div>Hello Word</div>
//     }
// }

// ReactDom.render(<App />, document.getElementById('root'))


// Tree Shaking (没有用的东西都从树上晃掉)
// 注意Tree Shaking支持ES6的引入方式,ES6是静态引入,commonjs是动态的就支持不了
// 我引入一个模块,但我只用了一个模块里面的一个方法
// 那么我没有引入的东西你就别给我打包了

// import { add } from "./module"
// add(1, 3)



// 代码分割
// 如果打包后的js文件过大,可能导致页面阻塞
// 如果我改了业务代码,则用户就要重新去加载整个js文件

// 我希望lodash这种库的打包后的代码放一个js文件
// 业务代码放一个js文件

// 1. 首先在另外一个文件去引入lodash
// 2. 在那个文件夹里面把lodash挂载到window上
// 3. 然后在配置文件里面把这个lodash.js加到入口文件里面去
// 4. 注意在入口文件里面要先写loadsh.js,后写index.js
// 这里就可以不用引入了
// import _ from 'lodash';

// 当我改变业务逻辑的时候
// 只有业务逻辑的index.js的文件会改变,lodash.js不会改变
// lodash.js在浏览器中有缓存,则不会重新加载

// console.log(_.join(['a', 'b', 'c'], '***'))


// 利用插件来进行代码分割
// 在配置里面去配置splitChunks,他就会自动帮你把外部的库单独打包到一个文件里面去
// 然后再html里面先给你引入外部库,再给你引入业务代码
// import _ from 'lodash';

// console.log(_.join(['a', 'b', 'c'], '***'))


// 写一个异步的lodash引入
// 我掉一个函数去异步的引入lodash
// 如果要实现异步引入就要先配置一下,让他能够解析这种异步引入
// npm install --save-dev @babel/plugin-syntax-dynamic-import
// 然后再babelrl里面的plugin里面配置

// 发现他也会给你做代码的分割,把分割的代码放到一个文件里面去
// async function getComponent() {
//     // 用注释的形式给我引入的这个异步模块命名,这个命名就是做代码分割的时候分割出来的文件名
//     const { default: _ } = await import(/*webpackChunkName:"lodash"*/"lodash")
//     const element = document.createElement('div');
//     element.innerHTML = _.join(['Dell', "li"], '-')
//     return element
// }


// document.addEventListener('click', () => {
//     getComponent().then(element => {
//         document.body.appendChild(element)
//     })
// })

// 总结一下,代码分割和webpack无关,不用webpack也可以做
// 同步代码: 在配置中的optimization里面去配置splitChunks
// 异步代码: 不用做代码分割,自动会给你拆分出来一个文件,因为配置项的默认值是async


// *************
// 代码覆盖率方面的优化
// 注意这里最好是将所有的异步代码或者懒加载都放到一个文件里面去通过异步引入的当时一次性全部引入进来,这样的话同步的代码就会变少,首屏加载速度就会变快

// 假设我这里点击是需要引入一个模块,但是我不希望这个模块的引入影像我的点击的效率
// 那么就不让这模块在点击的时候引入,而是在页面空闲的时候引入
// webpack官网Document - guides - code splitting - Prefetching/Preloading modules
// 利用魔法注释来注释一下这个引入就可以了
// /* webpackPreload: true */   和主流程一起加载
// /* webpackPrefetch: true */   等到主流程加载完成之后,有空闲的时候去加载
// document.addEventListener('click', () => {
//     import(/* webpackPrefetch: true */ "./module").then(({add}) => {
//         add(1, 2)
//     })
// })


// css代码分割
// 如果我这样引入两个,它会帮我把这个两个合并成一个css文件打包
// import "./src/index.css"
// import "./src/style1.css"


// 浏览器缓存

import _ from 'lodash';
// import $ from 'jquery'  // 这里可以在配置里用垫片来引入这个模块
const dom = $('<div>')
dom.html(_.join(['dell', 'lee'], ' '))
$('body').append(dom)