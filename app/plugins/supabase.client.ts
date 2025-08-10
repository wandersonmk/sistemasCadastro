import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const supabaseUrl =
    (config.public as any).supabaseUrl ||
    (import.meta as any).env?.NUXT_PUBLIC_SUPABASE_URL ||
    (import.meta as any).env?.SUPABASE_URL ||
    ''

  const supabaseKey =
    (config.public as any).supabaseKey ||
    (import.meta as any).env?.NUXT_PUBLIC_SUPABASE_KEY ||
    (import.meta as any).env?.SUPABASE_KEY ||
    ''

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[supabase] Variáveis não encontradas. Defina NUXT_PUBLIC_SUPABASE_URL/KEY ou SUPABASE_URL/KEY no .env e reinicie o dev server.')
    return {
      provide: {
        supabase: null as unknown as SupabaseClient
      }
    }
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

  return {
    provide: {
      supabase
    }
  }
})


