export type Funcionario = {
  id: number
  nome: string
  cargo: string
  endereco?: string | null
  email?: string | null
  // Supabase retorna numeric como string por padrão
  salario: string
}


