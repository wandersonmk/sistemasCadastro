// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
  ,runtimeConfig: {
    // Chaves privadas só disponíveis no servidor
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    public: {
      // Preferir prefixo NUXT_PUBLIC_* (exposto ao cliente) com fallback para SUPABASE_*
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '',
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || ''
    }
  },
  vite: {
    server: {
      // Desabilita HMR para evitar tentativas infinitas de conexão WS em alguns ambientes
      hmr: false
    }
  }
})