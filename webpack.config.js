const path = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {

  entry: {
    index: "./src/index.js"
  },
  
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "tmp"),

    // 注释掉 publicPath 是为了保证使用 url-loader 的时候，css 中的路径正常
    // publicPath: "/assets/"
  },

  resolve: {
    alias: {
      pages: path.resolve(__dirname, "src/pages"),
      components: path.resolve(__dirname, "src/components"),
      layouts: path.resolve(__dirname, "src/layouts")
    }
  },

  module: {

    rules: [

      // vue 处理
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },

      // js 处理
      {
        test: /\.js$/,
        loader: "babel-loader"
      },

      // css 处理
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            "css-loader", 
            {
              loader: "postcss-loader",
              options: {
                plugins: [ 
                  require("autoprefixer")({
                    browsers: [
                      "last 2 versions",
                      "last 6 iOS versions"
                    ]
                  }) 
                ]
              }
            }
          ]
        })
      },

      // 外部文件处理
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "images/[name].[ext]"
            }
          }
        ]
      }
    ]
  },

  plugins: [
    
    // 提取公共部分 js
    new webpack.optimize.CommonsChunkPlugin({
      name: "common",
      minChunks: 3
    }),

    // 提出 css 文件
    new ExtractTextPlugin({
      filename: `[name].css`
    }),
  ],

  devServer: {

    contentBase: path.resolve(__dirname),
    compress: true,
    port: 8912,
    open: true
  }
}