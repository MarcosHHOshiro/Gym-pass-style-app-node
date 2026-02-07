import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['cjs'],
  outDir: 'build',
  clean: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  shims: true,
  skipNodeModulesBundle: true,
  platform: 'node',
  target: 'node20',
})
