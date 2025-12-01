import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0', // Permite conexões externas
//     port: 3004, // Porta desejada
//   }, 
//    preview: {
//     port: 3004, // Altere para a porta desejada
//   },
//   build: {
//     outDir: 'dist', // Pasta de saída
//     assetsDir: 'assets', // Pasta de assets
//     emptyOutDir: true, // Limpa a pasta dist antes do build
//     rollupOptions: {
//       output: {
//         manualChunks: undefined // Para evitar divisão de chunks
//       }
//     }
//   }
// })


export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Aceita conexões externas
    port: 3004,
    hmr: {
      // Força o HMR a usar o mesmo host do navegador
      host: 'pontojus.app.am.trf1.gov.br',
      // Opcional: define protocolo (use 'wss' se for HTTPS)
      protocol: 'ws',
      // Mantém a porta igual à do servidor (evita fallback)
      port: 3004,
      // Alternativamente, use `clientPort` se quiser separar
      // clientPort: 3004,
    },
    // cors: true, // Descomente se precisar (cuidado em produção)
    // cors: {
    //   origin: "https://pontojus.app.am.trf1.gov.br",
    //   credentials: true,
    // },
  },
  preview: {
    port: 3004,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})