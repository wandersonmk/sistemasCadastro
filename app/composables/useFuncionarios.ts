import type { Funcionario } from '~/types/funcionarios'

export function useFuncionarios() {
  const { $supabase } = useNuxtApp()
  if (!$supabase) {
    throw new Error('Supabase client não inicializado.')
  }

  const funcionarios = useState<Funcionario[]>('funcionarios:list', () => [])
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)

  async function fetchAll(): Promise<Funcionario[]> {
    isLoading.value = true
    errorMessage.value = null
    try {
      const { data, error } = await $supabase
        .from('funcionarios')
        .select('*')
        .order('id', { ascending: true })
      if (error) throw error
      funcionarios.value = (data || []) as Funcionario[]
      return funcionarios.value
    } catch (err: any) {
      const msg = String(err?.message || 'Falha ao buscar funcionários.')
      errorMessage.value = msg
      throw new Error(msg)
    } finally {
      isLoading.value = false
    }
  }

  return { funcionarios, isLoading, errorMessage, fetchAll }
}


