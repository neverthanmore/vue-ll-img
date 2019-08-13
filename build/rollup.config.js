import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import { version } from '../package.json';
// const banner = `/*
//  * lazyLoad.js v${version}
//  * (c) ${new Date().getFullYear()} gbbacy <wjwcoder@gmail.com>
//  * Released under the MIT License.
//  */\n`;
export default {
  input: 'index.js',
  output: {
    file: './dist/lazyLoad.js',
    format: 'umd',
    name: 'lazyLoad'
  },
  plugins: [
    commonjs(),
    resolve(),
    uglify({
      output: {
        comments: 'some'
      }
    }),
    babel({
      runtimeHelpers: true
    }),
    replace({
      VUE_LL_VERSION: JSON.stringify(version)
    })
  ]
};
