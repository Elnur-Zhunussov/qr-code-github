import basicSsl from '@vitejs/plugin-basic-ssl';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
    base: command === 'build' ? '/qr-code-github/' : '/',
    plugins: [vue(), basicSsl()],
    server: {
        port: 3000,
        host: '0.0.0.0'
    }
}));
