const webpack = require('webpack');
const PATH = require('./path');
const path = require('path');
const fs = require('fs');
const entryFiles = fs.readdirSync(PATH.ENTRY_PATH);

const files = [];
const entries = {};

entryFiles
  .filter(file =>
    file.split('.')[0] && file.split('.').slice(-1)[0] === 'js'
  )
  .forEach(file => {
    const filename = file.split('.')[0];
    const filepath = path.join(PATH.ENTRY_PATH, file)
    entries[filename] = filepath;
});

module.exports = {
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    path: PATH.BUILD_PATH,
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {test: require.resolve("jquery"), loader: "expose?jQuery"},
      {test: require.resolve("jquery"), loader: "expose?$"},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css")},
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: ["babel-loader"],
        query: {
          presets: ["es2015"]
        }
      },
      // image & font
      {test: /\.(woff|woff2|eot|ttf|otf)$/i, loader: "url-loader?limit=8192&name=[name].[ext]"},
      {test: /\.(jpe?g|png|gif|svg)$/i, loader: "url-loader?limit=8192&name=[name].[ext]"}
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new ExtractTextPlugin("[name].bundle.css", {
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //       warnings: false
    //   }
    // }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': '"production"'
    // }),
    // new webpack.NoErrorsPlugin()
  ],
  debug: true,
  displayErrorDetails: true,
  outputPathinfo: true,
  devtool: "cheap-module-eval-source-map"
};