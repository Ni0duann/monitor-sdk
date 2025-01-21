import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'named'
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      clean: true
    })
  ],
  external: ['tslib'] // 添加这一行，将 tslib 声明为外部依赖
}; 