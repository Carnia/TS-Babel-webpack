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
    minimize: _PROD_,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
            drop_debugger: true,//去除debugeer和console
            drop_console: true,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: false,
      }),
    ],
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
