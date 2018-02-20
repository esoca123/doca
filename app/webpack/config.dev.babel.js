import webpack from 'webpack';
import path from 'path';
import ip from 'ip';
import { HOT_RELOAD_PORT, SRC_DIR, BUILD_DIR } from './constants';
import config from '../config';


const B = require('bluebird');
const fs = B.promisifyAll(require("fs"));


let appRootPath = '/Users/esoca123/local/repos/addaps_api_v2';

const dereferenceAddapsResolver = {
    order: 1,
    canRead: file => {

        let { url } = file;

        return /^\/schemas\//.test(url)
        return true
    },
    read: file => {

        let { extension, url } = file;

        let pathWithSlash = file.url

        let path = `${appRootPath}${pathWithSlash}`;

        return fs.readFileAsync(path)
    }
}



export default {
  cache: true,
  devtool: 'eval-cheap-module-source-map',
  entry: {
    app: [
      `webpack-hot-middleware/client?path=http://${ip.address()}:${HOT_RELOAD_PORT}/__webpack_hmr`,
      path.join(SRC_DIR, 'client/index.js'),
    ],
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
        presets: ['es2015', 'react', 'react-hmre'],
      },
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader',
      ],
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
      ],
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
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: `http://${ip.address()}:${HOT_RELOAD_PORT}/build/`,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('development') },
      IS_JAVASCRIPT: true,
      LAST_MODIFIED: Date.now(),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.json'],
    modules: ['src', 'node_modules'],
  },
};
