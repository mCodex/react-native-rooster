import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import alias from '@rollup/plugin-alias';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import babel from '@rollup/plugin-babel';

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load package.json
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

const extensions = [".js", ".jsx", ".ts", ".tsx", ".json"];

export default [
  {
    input: 'src/index.ts',
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [
      peerDepsExternal(),
      alias({
        entries: [
          { find: 'components', replacement: path.resolve(__dirname, 'src/components') },
          { find: 'contexts', replacement: path.resolve(__dirname, 'src/contexts') },
          { find: 'hooks', replacement: path.resolve(__dirname, 'src/hooks') },
          { find: 'providers', replacement: path.resolve(__dirname, 'src/providers') },
        ],
      }),
      resolve({ extensions, preferBuiltins: false }),
      commonjs(),
      json(),
      babel({
        babelHelpers: 'bundled', // Bundle all helpers directly into the output files
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        exclude: ['node_modules/**'],
        babelrc: false, // Ignore external babel config
        configFile: false, // Ignore external babel config
        presets: [
          ['@babel/preset-env', { 
            targets: { node: 'current' },
            modules: false  // Important for ES modules
          }],
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }]
        ]
      }),
      esbuild({
        sourceMap: true,
        target: 'es2015', // Using a more compatible target
        loaders: { '.json': 'json' },
      }),
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        inlineDynamicImports: true,
        exports: 'auto', // Handle all export types
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        inlineDynamicImports: true,
      },
    ],
    treeshake: { moduleSideEffects: false },
  },
  // Generate .d.ts bundle
  {
    input: 'src/index.ts',
    output: [{ file: 'build/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
