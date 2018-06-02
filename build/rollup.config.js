import rollup from 'rollup';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import alias from 'rollup-plugin-alias';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import path from 'path';
import typescript from 'rollup-plugin-typescript2';

const root = path.resolve(__dirname, './');
const port = 10002;

module.exports = {
    input: 'src/request/request.ts',
    sourcemap: true,
    output: {
        file: 'dist/request-model.esm.js',
        format: 'es',
        name: 'request-model',
        sourcemap: true,
    },
    plugins: [
        // uglify(),
        resolve(),
        typescript(),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            presets: [['env', { modules: false }]],
        }),
        alias({
            Request: path.resolve(__dirname, '../src/request'),
            Lib: path.resolve(__dirname, '../src/lib'),
            ASSETS: path.resolve(__dirname, '../asserts'),
        }),
    ],
    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
};
