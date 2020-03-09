

module.exports = {
    plugins: [
        // postcss-loader他要使用这个插件,需要把它引入
        // 后面要加上浏览器的类型,不然不好使
        require('autoprefixer')({
            "overrideBrowserslist": [
                "defaults",
                "not ie < 11",
                "last 2 versions",
                "> 1%",
                "iOS 7",
                "last 3 iOS versions"
            ]
        })
    ]
};