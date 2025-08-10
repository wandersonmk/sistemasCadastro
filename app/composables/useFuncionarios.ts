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
        .order('nome', { ascending: true })
      if (error) throw error
      funcionarios.value = ((data || []) as Funcionario[])
        .slice()
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
      return funcionarios.value
    } catch (err: any) {
      const msg = String(err?.message || 'Falha ao buscar funcionários.')
      errorMessage.value = msg
      throw new Error(msg)
    } finally {
      isLoading.value = false
    }
  }

  async function createOne(payload: {
    nome: string
    cargo: string
    endereco?: string | null
    email?: string | null
    salario: number | string
  }): Promise<Funcionario> {
    isLoading.value = true
    errorMessage.value = null
    try {
      const { data, error } = await $supabase
        .from('funcionarios')
        .insert({
          nome: payload.nome,
          cargo: payload.cargo,
          endereco: payload.endereco ?? null,
          email: payload.email ?? null,
          salario: payload.salario
        })
        .select('*')
        .single()
      if (error) throw error
      const created = data as Funcionario
      funcionarios.value = [...funcionarios.value, created].sort((a, b) =>
        a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
      )
      return created
    } catch (err: any) {
      const msg = String(err?.message || 'Falha ao criar funcionário.')
      errorMessage.value = msg
      throw new Error(msg)
    } finally {
      isLoading.value = false
    }
  }

  async function updateOne(
    id: number,
    payload: {
      nome: string
      cargo: string
      endereco?: string | null
      email?: string | null
      salario: number | string
    }
  ): Promise<Funcionario> {
    if (!Number.isFinite(id)) throw new Error('ID inválido para atualização.')
    isLoading.value = true
    errorMessage.value = null
    try {
      const { data, error } = await $supabase
        .from('funcionarios')
        .update({
          nome: payload.nome,
          cargo: payload.cargo,
          endereco: payload.endereco ?? null,
          email: payload.email ?? null,
          salario: payload.salario
        })
        .eq('id', id)
        .select('*')
        .single()
      if (error) throw error
      const updated = data as Funcionario
      const idx = funcionarios.value.findIndex((f) => Number(f.id) === Number(id))
      if (idx >= 0) {
        const next = [...funcionarios.value]
        next[idx] = updated
        funcionarios.value = next.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
      } else {
        funcionarios.value = [...funcionarios.value, updated].sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
        )
      }
      return updated
    } catch (err: any) {
      const msg = String(err?.message || 'Falha ao atualizar funcionário.')
      errorMessage.value = msg
      throw new Error(msg)
    } finally {
      isLoading.value = false
    }
  }

  async function deleteOne(id: number): Promise<void> {
    if (!Number.isFinite(id)) throw new Error('ID inválido para exclusão.')
    isLoading.value = true
    errorMessage.value = null
    try {
      const { error } = await $supabase.from('funcionarios').delete().eq('id', id)
      if (error) throw error
      funcionarios.value = funcionarios.value.filter((f) => Number(f.id) !== Number(id))
    } catch (err: any) {
      const msg = String(err?.message || 'Falha ao excluir funcionário.')
      errorMessage.value = msg
      throw new Error(msg)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchById(id: number): Promise<Funcionario | null> {
    if (!Number.isFinite(id)) return null
    isLoading.value = true
    errorMessage.value = null
    try {
      const { data, error } = await $supabase
        .from('funcionarios')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      const found = data as Funcionario
      // atualiza/insere na lista local
      const existingIndex = funcionarios.value.findIndex((f) => Number(f.id) === Number(found.id))
      if (existingIndex >= 0) {
        const next = [...funcionarios.value]
        next[existingIndex] = found
        funcionarios.value = next.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
      } else {
        funcionarios.value = [...funcionarios.value, found].sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
        )
      }
      return found
    } catch (err: any) {
      const msg = String(err?.message || 'Falha ao buscar funcionário.')
      errorMessage.value = msg
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { funcionarios, isLoading, errorMessage, fetchAll, fetchById, createOne, updateOne, deleteOne }
}


