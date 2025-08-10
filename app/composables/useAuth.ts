import type { LoginParams, SignupParams, SignupResult } from '~/types/auth'

export function useAuth() {
  const { $supabase } = useNuxtApp()
  if (!$supabase) {
    throw new Error('Supabase client não inicializado. Verifique as variáveis do .env e reinicie o servidor.')
  }

  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const user = useState('auth:user', () => null as any)

  function traduzirErro(err: any, contexto: 'login' | 'signup' = 'login'): string {
    const msg = String(err?.message ?? '').toLowerCase()
    // Mapeamentos comuns do Supabase
    if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('invalid email or password')) {
      return 'E-mail ou senha incorretos.'
    }
    if (msg.includes('email not confirmed')) {
      return 'E-mail ainda não confirmado. Verifique sua caixa de entrada.'
    }
    if (msg.includes('invalid email')) {
      return 'E-mail inválido.'
    }
    if (
      msg.includes('already registered') ||
      (msg.includes('already') && (msg.includes('registered') || msg.includes('exists') || msg.includes('taken') || msg.includes('used'))) ||
      msg.includes('duplicate key value')
    ) {
      return 'E-mail já cadastrado.'
    }
    if (msg.includes('too many requests') || msg.includes('rate limit')) {
      return 'Muitas tentativas. Tente novamente em alguns instantes.'
    }
    if (msg.includes('network') || msg.includes('fetch')) {
      return 'Falha de conexão. Verifique sua internet e tente novamente.'
    }
    return contexto === 'signup' ? 'Falha no cadastro. Tente novamente.' : 'Falha no login. Tente novamente.'
  }

  async function login({ email, password }: LoginParams) {
    isLoading.value = true
    errorMessage.value = null
    try {
      const { data, error } = await $supabase.auth.signInWithPassword({ email, password })
      if (error) {
        // Se o erro for de e-mail não confirmado, tentamos confirmar no servidor e repetir o login
        const msg = String(error.message || '').toLowerCase()
        if (msg.includes('email not confirmed')) {
          try {
            await $fetch('/api/auth/confirm-email', { method: 'POST', body: { email } })
            const retry = await $supabase.auth.signInWithPassword({ email, password })
            if (retry.error) throw retry.error
            user.value = retry.data.user
            return retry.data.user
          } catch (confErr) {
            throw error
          }
        }
        throw error
      }
      user.value = data.user
      return data.user
    } catch (err: any) {
      const traduzido = traduzirErro(err, 'login')
      errorMessage.value = traduzido
      throw new Error(traduzido)
    } finally {
      isLoading.value = false
    }
  }

  async function signup({ email, password }: SignupParams): Promise<SignupResult> {
    isLoading.value = true
    errorMessage.value = null
    try {
      const { data, error } = await $supabase.auth.signUp({ email, password })
      if (error) throw error
      // Considera o usuário "logado" na app assim que o cadastro retornar um usuário,
      // mesmo que a sessão não tenha sido criada (ignoramos confirmação de e-mail).
      if (data.user) user.value = data.user
      return { user: data.user, session: data.session }
    } catch (err: any) {
      const traduzido = traduzirErro(err, 'signup')
      errorMessage.value = traduzido
      throw new Error(traduzido)
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    errorMessage.value = null
    try {
      await $supabase.auth.signOut()
      user.value = null
    } catch (err: any) {
      // mantém silencioso, não queremos travar a UI no logout
    } finally {
      isLoading.value = false
    }
  }

  return { login, signup, logout, isLoading, errorMessage, user }
}


