const path = require('path'),
  webpack = require('webpack'),
  styleRules = require('./styleLoaderConf'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  ManifestPlugin = require('webpack-manifest-plugin'),
  SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const _PROD_ = process.env.NODE_ENV === 'production';

class MiniCssExtractPluginCleanup {
  constructor(deleteWhere = /\.js(\.map)?$/) {
    this.shouldDelete = new RegExp(deleteWhere)
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync("MiniCssExtractPluginCleanup", (compilation, callback) => {
      Object.keys(compilation.assets).forEach((asset) => {
        if (this.shouldDelete.test(asset)) {
          delete compilation.assets[asset]
        }
      })
      callback()
    })
  }
}

const resolve = (dir) => {
  return path.resolve(process.cwd(), dir)
}

module.exports = {
  entry: {
    app: resolve("src/index.ts"),
  },

  output: {
    path: resolve("dist"), // string

    publicPath: '/', // root Dir
    sourceMapFilename: '[name].map',
    chunkFilename: 'statics/js/[name].[chunkhash:8].js',
    filename: 'statics/js/[name].[hash:8].js'
  },

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [
          resolve("src")
        ],
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          // options: {
          //   presets: [
          //     ["@babel/preset-env", {
          //       targets: { ie: 9, },
          //       ignoreBrowserslistConfig: true,
          //       useBuiltIns: false,
          //       modules: false,
          //       exclude: ['transform-typeof-symbol'],
          //     }],
          //     ["@babel/preset-react", {
          //       "targets": "last 2 versions, ie 11", "modules": false
          //     }],
          //     ["@babel/preset-typescript"]
          //   ],
          //   plugins: [
          //     ['@babel/plugin-syntax-dynamic-import'],
          //     ['@babel/plugin-proposal-decorators', {legacy: true}],
          //     ['@babel/plugin-proposal-class-properties', {loose: true}],
          //     ["@babel/plugin-transform-runtime", ], //babel 支持 async
          //     ["import", {
          //       "libraryName": "antd-mobile",
          //       "libraryDirectory": "lib",
          //       "style": true
          //     }, "antd-mobile"]//动态引入anti，而不是整个anti包
          //   ]
          // }
        }, ]
      },
      ...styleRules,
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          name: "statics/css/fonts/[name].[hash:8].[ext]",
          limit: 2048
        }
      },
      {
        test: /\.(png|jpe?g|gif)(\?\S*)?$/,
        loader: "url-loader",
        options: {
          name: "statics/imgs/[name].[hash:8].[ext]",
          limit: 2048
        }
      }
    ]
  },

  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）
    modules: [
      "node_modules",
      resolve("src")
    ],
    // 用于查找模块的目录

    extensions: [".js", ".ts", ".tsx"],

    alias: {
      '@': resolve('src'),
      '@assets': resolve('src/assets'),
    }
  },


  context: __dirname, // string（绝对路径！）
  // webpack 的主目录
  // entry 和 module.rules.loader 选项
  // 相对于此目录解析

  target: "web", // default

  // externals: ["react", /^@angular\//],
  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们

  stats: "errors-only",
  // 精确控制要显示的 bundle 信息

  plugins: [
    new SWPrecacheWebpackPlugin({
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'serviceWorker.js',
      logger(message) {
        console.log(message);
        if (message.indexOf('Total precache size is') === 0) {
          return;
        }
        if (message.indexOf('Skipping statics resource') === 0) {
          return;
        }
      },
      minify: true,
      navigateFallback: '/index.html',
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new MiniCssExtractPlugin({
      filename: "statics/css/[name].[contenthash].css",
      chunkFilename: "statics/css/[name].[contenthash].css",
    }),
    // new MiniCssExtractPluginCleanup(/styles\..+\.js/),
    new webpack.ProvidePlugin({
      $http: [resolve('src/utils/http.ts'), 'default'],
      $msg: [resolve('node_modules/antd/es/message/index.js'), 'default']
    }),
    new CopyWebpackPlugin([{
      from: resolve('statics'),
      to: 'statics',
      ignore: ['.*']
    }])
  ]
}