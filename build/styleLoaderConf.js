const path = require('path'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin")

const _DEV_ = process.env.NODE_ENV === 'development'
const cssLoader={
      loader: 'css-loader',
      options: {
        modules: false,//插件中的css  关闭css 模块化
        localIdentName: '[local]_[hash:base64:5]'//配置生成的标识符(ident)
      }
    }
const cssLoader_modules={
      loader: 'css-loader',
      options: {
        modules: true,//开启css 模块化
        localIdentName: '[local]_[hash:base64:5]'//配置生成的标识符(ident)
      }
    }
const cssLoader_modules_TS={
      loader: 'typings-for-css-modules-loader',
      options: {
        modules: true,//开启css 模块化
        namedExport:true,
        camelCase:true,
        localIdentName: '[local]_[hash:base64:5]'//配置生成的标识符(ident)
      }
    }


const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: _DEV_ ? true : false,
    plugins: [
      // require('autoprefixer')({
      //   browsers: ["iOS>7", "Android>4", "Chrome > 31", "ff > 31", "ie >= 11"]
      // }),
      require('postcss-cssnext')({
        browsers: ["iOS>7", "Android>4", "Chrome > 31", "ff > 31", "ie >= 11"]
      }),
      require('postcss-px-to-viewport')({
        viewportWidth: 375, // (Number) The width of the viewport. 
        viewportHeight: 1334, // (Number) The height of the viewport. 
        unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to. 
        viewportUnit: 'vw', // (String) Expected units. 
        selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px. 
        minPixelValue: 1, // (Number) Set the minimum pixel value to replace. 
        mediaQuery: false // (Boolean) Allow px to be converted in media queries. 
      }),
      require('postcss-aspect-ratio-mini')({}),
      require('postcss-write-svg')({
        utf8: false
      }),
      // require('postcss-cssnext')({}), //兼容未来版本
      // require('postcss-pxtorem')({
      //   rootValue: 40,
      //   propList: ['*'],
      //   selectorBlackList: [/^\.(vux|weui)-[\w]*/]
      // })
    ]
  }
}

const styleRules = [
	{
    test: /\.scss$/,
    use: [
      'style-loader',
      cssLoader_modules_TS,//页面中的样式都进行模块化处理,这里采用 ts 的css-loader，如果不用 ts 就直接用css-loader的模块化配置
      postcssLoader,
      'sass-loader'
    ],
    include: [path.join(__dirname, '../src')],
    exclude: [path.join(__dirname, '../src/style/')],
  },
	{
    test: /\.scss$/,
    use: [
      'style-loader',
      'css-loader',
      postcssLoader,
      'sass-loader'
    ],
    include: [path.join(__dirname, '../src/style/')],//style公共文件夹不模块化处理
  },
  {
    test: /\.less$/,
    use: [
      'style-loader',
      'css-loader',
      postcssLoader,
      {
        loader: 'less-loader',
        options: {
          // modifyVars: { '@primary-color': '#1DA57A' },
          javascriptEnabled: true
        }
      }
    ]
  },
  {
    test: /\.css$/,
    exclude: /node_modules|iconfont/,
    use: [
      'style-loader',
      cssLoader_modules,
      postcssLoader
    ]
  },
  // 对于node_modules 中的less文件,不开启css module模式
  {
    test: /\.css$/,
    include: /node_modules|iconfont/,
    use: [
      'style-loader',
      cssLoader,
      postcssLoader
    ]
  },
]
if(!_DEV_) {
  styleRules.forEach(rule => {
    rule.use.splice(0, 1, MiniCssExtractPlugin.loader)
  })
}
module.exports = styleRules
