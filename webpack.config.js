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
    publicPath: "/assets/"
  },

  module: {

    rules: [

      {
        test: /\.js$/,
        loader: "babel-loader"
      },

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
                      "last 2 versions"
                    ]
                  }) 
                ]
              }
            }
          ]
        })
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
    port: 8914,
    open: "http://192.168.0.53:8914"
  }
}