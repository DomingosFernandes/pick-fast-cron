// rollup.config.js
import typescript from "@rollup/plugin-typescript";

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es'
  },
  plugins: [typescript()],
  external: ['node-fetch', 'bottleneck', 'mongodb', 'dotenv', 'lodash'],
};