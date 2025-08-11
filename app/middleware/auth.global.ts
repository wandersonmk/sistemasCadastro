export default defineNuxtRouteMiddleware(async (to) => {
  // Executa apenas no client, pois o Supabase está configurado como client-only
  if (process.server) return

  const { $supabase } = useNuxtApp() as any
  const userState = useState<any>('auth:user')

  const isLoginRoute = to.path === '/login'
  const isObrigado = to.path === '/obrigado'
  // Ignora caminhos internos do Nuxt/Vite e arquivos estáticos
  const path = to.path || ''
  if (
    path.startsWith('/_nuxt') ||
    path.startsWith('/__nuxt') ||
    path.startsWith('/__vite') ||
    path.startsWith('/vite') ||
    path.startsWith('/@vite') ||
    path.startsWith('/@id') ||
    path.startsWith('/@fs') ||
    path.startsWith('/favicon') ||
    path.startsWith('/robots.txt') ||
    path.endsWith('.js') ||
    path.endsWith('.mjs') ||
    path.endsWith('.css') ||
    path.endsWith('.map') ||
    path.endsWith('.json')
  ) {
    return
  }

  let isAuthenticated = Boolean(userState.value)

  // Se ainda não sabemos, tenta recuperar a sessão do Supabase
  if (!isAuthenticated && $supabase) {
    try {
      const { data } = await $supabase.auth.getSession()
      if (data?.session?.user) {
        userState.value = data.session.user
        isAuthenticated = true
      }
    } catch {
      // silencioso: sem sessão válida
    }
  }

  // Regras de navegação
  if (isLoginRoute && isAuthenticated) {
    return navigateTo('/')
  }

  // Permite acesso à página de obrigado sem header e sem sessão
  if (isObrigado) {
    return
  }

  if (!isLoginRoute && !isAuthenticated) {
    return navigateTo('/login')
  }
})


