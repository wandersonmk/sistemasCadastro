import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { H3Event, createError, defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{ email: string; password: string }>(event)
  const email = (body?.email || '').trim()
  const password = String(body?.password || '')

  if (!email || !/[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'E-mail inválido.' })
  }
  if (!password || password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Senha deve ter ao menos 6 caracteres.' })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = (config.public as any).supabaseUrl as string
  const serviceRoleKey = (config as any).supabaseServiceRoleKey as string

  if (!supabaseUrl || !serviceRoleKey) {
    throw createError({ statusCode: 500, statusMessage: 'Configuração do Supabase ausente no servidor.' })
  }

  const admin: SupabaseClient = createClient(supabaseUrl, serviceRoleKey)

  // Verifica se usuário já existe
  const { data: byEmail, error: getErr } = await admin.auth.admin.getUserByEmail(email)
  if (byEmail?.user) {
    throw createError({ statusCode: 409, statusMessage: 'E-mail já cadastrado.' })
  }
  // getUserByEmail pode retornar erro quando não existe; seguimos em frente nesse caso

  // Cria usuário com email confirmado para pular verificação
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    // Conflito de e-mail
    if (String(error.message).toLowerCase().includes('already')) {
      throw createError({ statusCode: 409, statusMessage: 'E-mail já cadastrado.' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Falha no cadastro.' })
  }

  // Garante que o e-mail esteja confirmado (defensivo)
  if (data.user?.id) {
    await admin.auth.admin.updateUserById(data.user.id, { email_confirm: true })
  }

  return { ok: true, userId: data.user?.id }
})


