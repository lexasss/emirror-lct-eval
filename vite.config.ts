import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import vuePugPlugin from 'vue-pug-plugin'

const baseConfig = {
    plugins: [vue({
      template: {
        preprocessOptions: { // 'preprocessOptions' is passed through to the pug compiler 
          plugins: [
            vuePugPlugin
          ]
        }
      }
    })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };

const devConfig = baseConfig;

const buildConfig = {...baseConfig, ...{
    base: '/emirror-lct-eval/'
}};


export default defineConfig(({ command, mode }) => {
    console.log(`Build CMD = ${command}, MODE = ${mode}`);
    if (command === 'serve') {
        return devConfig;
    } else {
        return buildConfig;
    } 
  })
