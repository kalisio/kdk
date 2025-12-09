import { defineConfig, mergeConfig } from 'vite'
import viteConfig from './vite.config'
import 'vitest/config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom'
    }
  })
)