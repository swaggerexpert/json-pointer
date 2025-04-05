import path from 'node:path';
import { nonMinimizeTrait, minimizeTrait } from './traits.config.js';

const browser = {
  mode: 'production',
  entry: ['./src/index.js'],
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'json-pointer.browser.js',
    libraryTarget: 'umd',
    library: 'JSONPointer',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
    ],
  },
  ...nonMinimizeTrait,
};

const browserMin = {
  mode: 'production',
  entry: ['./src/index.js'],
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'json-pointer.browser.min.js',
    libraryTarget: 'umd',
    library: 'JSONPointer',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
    ],
  },
  ...minimizeTrait,
};

export default [browser, browserMin];
