const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return ({
    entry: './src/index.ts',
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Planetary Sequencer',
        template: 'src/index.html'
      }),
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'docs'),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
              loader: "babel-loader"
          },
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".json"]
    },
    devServer: {
      port: 3001,
      open: true,
      stats: {
        children: false, // Hide children information
        maxModules: 0
      }
    },
    devtool: isDevelopment ? 'inline-source-map' : false
  })
  
};