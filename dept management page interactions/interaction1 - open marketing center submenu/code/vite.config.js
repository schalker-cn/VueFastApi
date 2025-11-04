import { defineConfig, loadEnv } from 'vite'

import { convertEnv, getSrcPath, getRootPath } from './build/utils'
import { createVitePlugins } from './build/plugin'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command, mode }) => {
  const srcPath = getSrcPath()
  const rootPath = getRootPath()
  const isBuild = command === 'build'

  const env = loadEnv(mode, process.cwd())
  const viteEnv = convertEnv(env)
  const { VITE_PORT, VITE_PUBLIC_PATH } = viteEnv

  return {
    base: VITE_PUBLIC_PATH || '/',
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath,
      },
    },
    plugins: [
      ...createVitePlugins(viteEnv, isBuild),
      viteMockServe({
        mockPath: 'src/mocks',
        localEnabled: !isBuild,
        watchFiles: true,
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: VITE_PORT,
      open: true,
    },
  }
})
