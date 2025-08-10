import { H3Event, createError, defineEventHandler, readBody } from 'h3'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event: H3Event) => {
  const { email } = await readBody<{ email: string }>(event)
  if (!email || !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'E-mail inválido.' })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = (config.public as any).supabaseUrl as string
  const serviceRoleKey = (config as any).supabaseServiceRoleKey as string
  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuração do Supabase ausente no servidor.' })
  }

  const admin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey)

  // Obtem usuário por e-mail
  const { data, error } = await admin.auth.admin.getUserByEmail(email)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Falha ao confirmar e-mail.' })
  }
  if (!data?.user?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Usuário não encontrado.' })
  }

  // Confirma o e-mail se ainda não estiver confirmado
  await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true })

  return { ok: true }
})


