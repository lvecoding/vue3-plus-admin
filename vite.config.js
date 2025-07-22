import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postCssPxToRem from 'postcss-pxtorem'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: [...createVitePlugins(env, command === 'build'), vueJsx()],
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // vite 相关配置
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/dev-api': {
          target: 'http://127.0.0.1:8080/api/',
          changeOrigin: true,
          rewrite: p => p.replace(/^\/dev-api/, '')
        }
      }
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: atRule => {
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          },
          postCssPxToRem({
            // 自适应，px>rem转换
            rootValue: 192, //pc端建议：192，移动端建议：75；设计稿宽度的1 / 10
            propList: ['*', '!border'], // 除 border 外所有px 转 rem // 需要转换的属性，这里选择全部都进行转换
            selectorBlackList: ['norem', 'van-'], // 过滤掉norem-开头的class，不进行rem转换，这个内容可以不写
            exclude: /node_modules(\\|\/)(element-plus|vant)/,
            unitPrecision: 5, // 转换后的精度，即小数点位数
            replace: true, // 是否直接更换属性值而不添加备份属性
            mediaQuery: false, // 是否在媒体查询中也转换px为rem
            minPixelValue: 0 // 设置要转换的最小像素值
          })
        ]
      }
    }
  }
})
