import ExtractTextPlugin from 'extract-text-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import chalk from 'chalk';
import { SRC_DIR, BUILD_DIR } from './constants';
import config from '../config';


const B = require('bluebird');
const fs = B.promisifyAll(require("fs"));


let appRootPath = path.join(__dirname, '..', '..');

const dereferenceAddapsResolver = {
    order: 1,
    canRead: file => {

        let { url } = file;

        console.log('------canRead------', url)

        return /^\/schemas\//.test(url)
    },
    read: file => {

        let { extension, url } = file;

        let pathWithSlash = file.url

        let path = `${appRootPath}${pathWithSlash}`;

        console.log('------path------', path)


        return fs.readFileAsync(path)
    }
}


export default {
  cache: false,
  entry: {
    app: [path.join(SRC_DIR, 'client/index.js')],
    static: [path.join(__dirname, 'build.js')],
  },
  module: {
    rules: [{
      loader: 'url-loader?limit=10000',
      test: /.(jpg|gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=.&]+)?$/,
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        plugins: ['transform-class-properties'],
        presets: ['es2015', 'react'],
      },
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader!less-loader',
      }),
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader!sass-loader',
      }),
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader',
      }),
    }, {
      test: /\.json$/,
      include: path.resolve(__dirname, '../node_modules'),
      loader: 'json-loader',
    }, {
      test: /\.json$/,
      exclude: path.resolve(__dirname, '../node_modules'),
      use: [
        `json-schema-example-loader?${JSON.stringify(config)}`,
        {
            loader: '@addaps/json-schema-loader',
            options: {
                'json-schema-ref-parser': {
                    dereferenceOptions: {
                        resolve: {
                            addaps: dereferenceAddapsResolver
                        }
                    }
                }
            }
        }
      ],
    }],
  },
  output: {
    path: BUILD_DIR,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    libraryTarget: 'umd',
  },
  plugins: [
    new ProgressBarPlugin({
      format: `  build [:bar] ${chalk.green.bold(':percent')} (:elapsed seconds)`,
      clear: false,
    }),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new ExtractTextPlugin({
      filename: 'app-[hash].css',
      allChunks: true,
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
  resolve: {
    extensions: ['.js'],
    modules: ['src', 'node_modules'],
  },
};
