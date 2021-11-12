(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{375:function(t,a,e){t.exports=e.p+"assets/img/HMR.f72d2d76.png"},408:function(t,a,e){"use strict";e.r(a);var s=e(29),n=Object(s.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h2",{attrs:{id:"webpack"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#webpack"}},[t._v("#")]),t._v(" webpack")]),t._v(" "),s("h3",{attrs:{id:"webpack-hrm原理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#webpack-hrm原理"}},[t._v("#")]),t._v(" webpack-HRM原理")]),t._v(" "),s("p",[s("img",{attrs:{src:e(375),alt:"webpack-HRM原理"}})]),t._v(" "),s("h3",{attrs:{id:"tree-shaking"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#tree-shaking"}},[t._v("#")]),t._v(" Tree-shaking")]),t._v(" "),s("p",[s("a",{attrs:{href:"https://juejin.cn/post/6844903544756109319",target:"_blank",rel:"noopener noreferrer"}},[t._v("Tree-Shaking性能优化实践 - 原理篇"),s("OutboundLink")],1),t._v(" "),s("a",{attrs:{href:"https://juejin.cn/post/6844903544760336398",target:"_blank",rel:"noopener noreferrer"}},[t._v("Tree-Shaking性能优化实践 - 实践篇"),s("OutboundLink")],1)]),t._v(" "),s("h3",{attrs:{id:"webpack优化"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#webpack优化"}},[t._v("#")]),t._v(" webpack优化")]),t._v(" "),s("ol",[s("li",[t._v("webpack自带tree shaking(去除无用代码)")]),t._v(" "),s("li",[t._v("uglifyjs(代码压缩混淆)/terser-webpack-plugin")]),t._v(" "),s("li",[t._v("include exclude")]),t._v(" "),s("li",[t._v("alias 别名@")]),t._v(" "),s("li",[t._v("extensions 出现频率较高的文件后缀")]),t._v(" "),s("li",[t._v("happyPack 多进程loader转换/terser-webpack-plugin")]),t._v(" "),s("li",[t._v("dll 抽离第三方模块 我们都不希望这个开发的主力框架每次都被打包一遍，这样也是费时费力的事情; 如react, vue ,等不需要修改的库；add-asset-html-webpack-plugin 在index.html引入dll")]),t._v(" "),s("li",[t._v("webpack-bundle-analyzer 明确使用的包")]),t._v(" "),s("li",[t._v("CDN 在html文件中引入cdn文件，在webpack配置 externals，这样就不会打包引入的cdn的库;html-webpack-externals-plugin插入CDN文件到index.html")]),t._v(" "),s("li",[t._v("noParse noParse的作用是不去解析你所使用的第三方库中的依赖库")]),t._v(" "),s("li",[t._v("IgnorePlugin 忽略打包第三方模块指定的目录")]),t._v(" "),s("li",[t._v("webpack-dev-server 热更新和代理")]),t._v(" "),s("li",[t._v("webpack4中自带了抽取公共代码的方法，通过optimization里的splitChunks来做到 如lodash, vue, vuex, react, react-dom第三方库")])]),t._v(" "),s("p",[s("a",{attrs:{href:"https://juejin.cn/post/6844904093463347208",target:"_blank",rel:"noopener noreferrer"}},[t._v("带你深度解锁Webpack系列(优化篇)"),s("OutboundLink")],1)]),t._v(" "),s("h3",{attrs:{id:"webpack如何分包"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#webpack如何分包"}},[t._v("#")]),t._v(" webpack如何分包")]),t._v(" "),s("ul",[s("li",[t._v("旧版本\nCommonsChunkPlugin")]),t._v(" "),s("li",[t._v("webpack4")])]),t._v(" "),s("div",{staticClass:"language-js line-numbers-mode"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("module"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("exports "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    optimization"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        splitChunks"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            cacheGroups"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                utils"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                    chunks"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" initial"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    minSize"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n                    minChunks"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("//两个文件使用")]),t._v("\n                "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n            "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])]),t._v(" "),s("div",{staticClass:"line-numbers-wrapper"},[s("span",{staticClass:"line-number"},[t._v("1")]),s("br"),s("span",{staticClass:"line-number"},[t._v("2")]),s("br"),s("span",{staticClass:"line-number"},[t._v("3")]),s("br"),s("span",{staticClass:"line-number"},[t._v("4")]),s("br"),s("span",{staticClass:"line-number"},[t._v("5")]),s("br"),s("span",{staticClass:"line-number"},[t._v("6")]),s("br"),s("span",{staticClass:"line-number"},[t._v("7")]),s("br"),s("span",{staticClass:"line-number"},[t._v("8")]),s("br"),s("span",{staticClass:"line-number"},[t._v("9")]),s("br"),s("span",{staticClass:"line-number"},[t._v("10")]),s("br"),s("span",{staticClass:"line-number"},[t._v("11")]),s("br"),s("span",{staticClass:"line-number"},[t._v("12")]),s("br"),s("span",{staticClass:"line-number"},[t._v("13")]),s("br")])]),s("h3",{attrs:{id:"玩转webpackppt"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#玩转webpackppt"}},[t._v("#")]),t._v(" 玩转webpackppt")]),t._v(" "),s("ol",[s("li",[s("a",{attrs:{href:"/interview/%E7%8E%A9%E8%BD%ACwebpackppt%E7%AC%AC%E4%B8%80%E7%AB%A0.pdf"}},[t._v("玩转webpackppt 第一章")])]),t._v(" "),s("li",[s("a",{attrs:{href:"/interview/%E7%8E%A9%E8%BD%ACwebpackppt%E7%AC%AC%E4%BA%8C%E7%AB%A0.pdf"}},[t._v("玩转webpackppt 第二章")])]),t._v(" "),s("li",[s("a",{attrs:{href:"/interview/%E7%8E%A9%E8%BD%ACwebpackppt%E7%AC%AC%E4%B8%89%E7%AB%A0.pdf"}},[t._v("玩转webpackppt 第三章")])]),t._v(" "),s("li",[s("a",{attrs:{href:"/interview/%E7%8E%A9%E8%BD%ACwebpackppt%E7%AC%AC%E5%9B%9B%E7%AB%A0.pdf"}},[t._v("玩转webpackppt 第四章")])]),t._v(" "),s("li",[s("a",{attrs:{href:"/interview/%E7%8E%A9%E8%BD%ACwebpackppt%E7%AC%AC%E4%BA%94%E7%AB%A0.pdf"}},[t._v("玩转webpackppt 第五章")])]),t._v(" "),s("li",[s("a",{attrs:{href:"/interview/%E7%8E%A9%E8%BD%ACwebpackppt%E7%AC%AC%E5%85%AD%E7%AB%A0.pdf"}},[t._v("玩转webpackppt 第六章")])]),t._v(" "),s("li",[s("a",{attrs:{href:"/interview/%E7%8E%A9%E8%BD%ACwebpackppt%E7%AC%AC%E4%B8%83%E7%AB%A0.pdf"}},[t._v("玩转webpackppt 第七章")])]),t._v(" "),s("li",[s("a",{attrs:{href:"/interview/%E7%8E%A9%E8%BD%ACwebpackppt%E7%AC%AC%E5%85%AB%E7%AB%A0.pdf"}},[t._v("玩转webpackppt 第八章")])])])])}),[],!1,null,null,null);a.default=n.exports}}]);