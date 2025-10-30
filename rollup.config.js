import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import fs from 'fs';
import path from 'path';
import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagesDir = path.resolve(__dirname, 'packages');
const packageFiles = fs.readdirSync(packagesDir);
function output(path) {
  return [
    {
      input: [`./packages/${path}/src/index.ts`],
      output: [
        {
          file: `./packages/${path}/dist/index.cjs.js`,
          format: 'cjs',
          sourcemap: true
        },
        {
          file: `./packages/${path}/dist/index.esm.js`,
          format: 'esm',
          sourcemap: true
        },
        {
          file: `./packages/${path}/dist/index.js`,
          format: 'umd',
          name: 'lz-monitor',
          sourcemap: true
        },
        {
          file: `./packages/${path}/dist/index.min.js`,
          format: 'umd',
          name: 'lz-monitor',
          sourcemap: true,
          plugins: [uglify()]
        }
      ],
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              module: 'ESNext'
            },
            exclude: ['**/test/**', '**/web/**', '**/server/**', '**/node_modules/**']
          },
          useTsconfigDeclarationDir: true
        }),
        resolve(),
        commonjs(),
        json()
      ]
    },
    {
      input: `./packages/${path}/src/index.ts`,
      output: [
        { file: `./packages/${path}/dist/index.cjs.d.ts`, format: 'cjs' },
        { file: `./packages/${path}/dist/index.esm.d.ts`, format: 'esm' },
        { file: `./packages/${path}/dist/index.d.ts`, format: 'umd' },
        { file: `./packages/${path}/dist/index.min.d.ts`, format: 'umd' }
      ],
      plugins: [dts()]
    }
  ];
}

export default [...packageFiles.map(path => output(path)).flat()];
