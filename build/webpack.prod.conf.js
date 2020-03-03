'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin  = require('script-ext-html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const safePostCssParser = require('postcss-safe-parser');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const _PROD_ = process.env.NODE_ENV === 'production'
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  optimization: {
    runtimeChunk: {
      name: "manifest"
    },
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '_',
      name: true,
      cacheGroups: {
        // commons: { //公共模块 
        //   name: "commons",
        //   test: /node_modules\/react-route-dom/,
        //   chunks: "initial", //入口处开始提取代码
        //   minSize: 0, //代码最小多大，进行抽离
        //   minChunks: 2, //代码复 2 次以上的抽离
        //   priority: 10,
        //   enforce:true
        // },
        // app: {
        //   test: /node_modules\/react-route-dom/,
        //   name: 'app',
        //   minSize: 0,
        //   minChunks: 1,
        //   chunks: 'initial',
        //   priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理 
        // },
        utils: {
          name: 'common',
          test: /node_modules\/*/,
          chunks: 'all',
          priority: 10,
          enforce:true
        },
        // styles: {
        //   name: 'styles',
        //   test: /\.css|scss|less$/,
        //   chunks: 'all',
        //   enforce:true
        // }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {root: path.resolve(__dirname, '../')}),
    new OptimizeCSSAssetsPlugin({
      // cssProcessor: require('cssnano')({ autoprefixer: false })
      cssProcessorOptions: {
        parser: safePostCssParser,
        map: false
          ? {
              // `inline: false` forces the sourcemap to be output into a
              // separate file
              inline: false,
              // `annotation: true` appends the sourceMappingURL to the end of
              // the css file, helping the browser find the sourcemap
              annotation: true,
            }
          : false,
      },
    }),
    new HtmlWebpackPlugin({
      title: '',
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.html'),
      inject: true,
      minify: {
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
    }),
    new ScriptExtHtmlWebpackPlugin({
      //`runtime` must same as runtimeChunk name. default is `runtime`
      inline: /[^_](manifest|style|app)..*.(js)$/
    }),
    // keep modules.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // gzip压缩
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp('\\.(' +  ['js', 'css'].join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    }),
    new BundleAnalyzerPlugin(),
  ]
})

module.exports = webpackConfig
