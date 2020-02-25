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
import React, { Component } from 'react'
import ReactDom from 'react-dom'
class App extends Component {
    render() {
        return <div>Hello Word</div>
    }
}

ReactDom.render(<App />, document.getElementById('root'))