import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // 当没有测试用例时，也不会报错
    passWithNoTests: true,
    // exclude 的文件不会被测试
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    // 并行执行测试用例，可以加快测试速度
    threads: true
  }
});
