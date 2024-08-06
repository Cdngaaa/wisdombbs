import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{  //配置代理服务器
    hmr:true,
    port:3004,  //配置前端端口3004
    proxy:{
      "/api":{  //以/api开头的路径就需要进入代理，否则不需要
        target:"http://localhost:7070", //服务器端口7070
        changeOrigin:true,
        pathRewrite:{
          "^/api":"/api"  //路径重写，后端实际上也需要路径中包含/api
        }
      }
    }
  },
  build:{
    chunkSizeWarningLimit:3000,
    rollupOptions:{
      output:{
        manualChunks(id){
          if(id.includes('node_modules')){
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    chunkFileNames:(chunkInfo) => {
      const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
      const fileName = facadeModuleId[facadeModuleId.length -2] || '[name]';
      return `js/${fileName}/[name].[hash].js`;
    }
  }
})
