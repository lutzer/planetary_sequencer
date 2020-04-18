const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  const builDir = 'docs/v1'

  return ({
    entry: './src/index.ts',
    plugins: [
      isDevelopment? () => {} : new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Planetary Sequencer',
        template: 'src/index.html'
      }),
      new CopyPlugin([
        { from: 'src/assets', to: 'assets' },
        { from: 'src/dat.css', to: 'dat.css'}
      ]),
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, builDir),
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
        }
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