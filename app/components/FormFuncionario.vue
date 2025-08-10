<script setup lang="ts">
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'
import AppDropdown from '~/components/AppDropdown.vue'
import AppCurrencyInput from '~/components/AppCurrencyInput.vue'
import { useFuncionarios } from '~/composables/useFuncionarios'
import { useToast } from '~/composables/useToast'
import type { Funcionario } from '~/types/funcionarios'
import { useRouter, useRoute } from 'vue-router'

const props = withDefaults(defineProps<{ isnovo?: boolean; initial?: Partial<Funcionario> | null }>(), { isnovo: true, initial: null })

const nome = ref<string>('')
const cargo = ref<string | null>(null)
const endereco = ref<string>('')
const email = ref<string>('')
const salario = ref<string>('')

const emailError = ref<string | null>(null)

function isValidEmail(value: string): boolean {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value)
}

watch(email, (val) => {
  if (!val) {
    emailError.value = null
    return
  }
  emailError.value = isValidEmail(val) ? null : 'E-mail inválido.'
})

const { createOne, updateOne, isLoading, fetchAll } = useFuncionarios()
const { success, error: toastError } = useToast()
const router = useRouter()
const route = useRoute()

function resetForm() {
  nome.value = ''
  cargo.value = null
  endereco.value = ''
  email.value = ''
  salario.value = ''
  emailError.value = null
}

function numberToBRL(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

// Prefill when editing
onMounted(() => {
  if (!props.isnovo && props.initial) {
    if (props.initial.nome) nome.value = String(props.initial.nome)
    if (props.initial.cargo) cargo.value = String(props.initial.cargo)
    if (props.initial.endereco) endereco.value = String(props.initial.endereco)
    if (props.initial.email) email.value = String(props.initial.email)
    if (props.initial.salario !== undefined && props.initial.salario !== null)
      salario.value = numberToBRL(props.initial.salario)
  }
})

watch(
  () => props.initial,
  (val) => {
    if (!props.isnovo && val) {
      if (val.nome) nome.value = String(val.nome)
      if (val.cargo) cargo.value = String(val.cargo)
      if (val.endereco) endereco.value = String(val.endereco)
      if (val.email) email.value = String(val.email)
      if (val.salario !== undefined && val.salario !== null)
        salario.value = numberToBRL(val.salario)
    }
  },
  { deep: true }
)

// Autocomplete de endereço (Nominatim OpenStreetMap)
const isSearchingAddress = ref(false)
const addressSuggestions = ref<string[]>([])
const showAddressSuggestions = ref(false)
let addressDebounce: ReturnType<typeof setTimeout> | null = null
const hasInteractedAddress = ref(false)

function extractHouseNumberFromInput(input: string): string | null {
  if (!input) return null
  const tokens = input.trim().split(/[\s,]+/)
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i]
    if (typeof token === 'string' && /^\d+[A-Za-z]?$/.test(token)) {
      return token as string
    }
  }
  return null
}

function formatAddressSuggestion(addr: any, typedNumber?: string | null): string {
  const road = addr?.road || addr?.pedestrian || addr?.footway || addr?.cycleway || addr?.residential || addr?.path
  const houseNumber = addr?.house_number || typedNumber || ''
  const level1 = addr?.suburb || addr?.neighbourhood || addr?.village || addr?.hamlet || addr?.locality
  const level2 = addr?.city_district || addr?.district || addr?.borough
  const city = addr?.city || addr?.town || addr?.municipality || addr?.state_district

  const parts: string[] = []
  if (road) parts.push(String(road))
  if (houseNumber) parts[0] = parts[0] + `, ${houseNumber}`
  if (level1) parts.push(String(level1))
  if (level2 && level2 !== level1) parts.push(String(level2))
  if (city && city !== level1 && city !== level2) parts.push(String(city))
  return parts.join(', ')
}

async function fetchAddressSuggestions(query: string) {
  if (!query || query.length < 3) {
    addressSuggestions.value = []
    return
  }
  try {
    isSearchingAddress.value = true
    const typedNumber = extractHouseNumberFromInput(query)
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=br&limit=5&q=${encodeURIComponent(
      query
    )}`
    const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } })
    const data = (await res.json()) as Array<{ address: any }>
    addressSuggestions.value = (data || [])
      .map((d) => formatAddressSuggestion(d.address, typedNumber))
      .filter((s) => s && s.length > 0)
    showAddressSuggestions.value = addressSuggestions.value.length > 0
  } catch {
    addressSuggestions.value = []
  } finally {
    isSearchingAddress.value = false
  }
}

watch(
  () => endereco.value,
  (val) => {
    if (!hasInteractedAddress.value) {
      // Ignora mudanças programáticas (ex.: prefill ao editar)
      return
    }
    if (addressDebounce) clearTimeout(addressDebounce)
    if (!val || val.trim().length < 3) {
      addressSuggestions.value = []
      showAddressSuggestions.value = false
      return
    }
    addressDebounce = setTimeout(() => fetchAddressSuggestions(val.trim()), 400)
  }
)

function onEnderecoFocus() {
  if (hasInteractedAddress.value && addressSuggestions.value.length > 0) {
    showAddressSuggestions.value = true
  }
}

function onEnderecoBlur() {
  setTimeout(() => (showAddressSuggestions.value = false), 150)
}

function selectAddress(suggestion: string) {
  endereco.value = suggestion
  showAddressSuggestions.value = false
}

function onEnderecoUserInput() {
  if (!hasInteractedAddress.value) hasInteractedAddress.value = true
}

function brlToNumber(masked: string): number {
  // Remove R$, espaços (incluindo \u00A0), pontos de milhar e troca vírgula por ponto
  const cleaned = masked
    .replace(/\s|\u00A0/g, '')
    .replace(/[R$]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : NaN
}

async function onSubmit() {
  if (email.value && !isValidEmail(email.value)) {
    emailError.value = 'E-mail inválido.'
    return
  }

  // apenas salvar quando for novo registro
  if (props.isnovo) {
    try {
      // Converte máscara BRL para número (ex.: "R$ 1.500,50" -> 1500.50)
      const salarioNumber = brlToNumber(salario.value)
      if (!Number.isFinite(salarioNumber)) {
        throw new Error('Salário inválido.')
      }

      if (!nome.value.trim() || !cargo.value || !endereco.value.trim() || !email.value.trim()) {
        throw new Error('Preencha todos os campos obrigatórios.')
      }

      const payload = {
        nome: nome.value.trim(),
        cargo: (cargo.value || '').toString(),
        endereco: endereco.value ? endereco.value.trim() : null,
        email: email.value ? email.value.trim() : null,
        salario: salarioNumber
      }

      await createOne(payload as any)
      success('Funcionário salvo com sucesso!')
      resetForm()
    } catch (e: any) {
      toastError(e?.message || 'Erro ao salvar funcionário.')
    }
  } else {
    // Edição
    try {
      const salarioNumber = brlToNumber(salario.value)
      if (!Number.isFinite(salarioNumber)) throw new Error('Salário inválido.')
      if (!nome.value.trim() || !cargo.value || !endereco.value.trim() || !email.value.trim()) {
        throw new Error('Preencha todos os campos obrigatórios.')
      }
      const id = Number(route.params.id)
      if (!Number.isFinite(id)) throw new Error('ID inválido.')
      const payload = {
        nome: nome.value.trim(),
        cargo: (cargo.value || '').toString(),
        endereco: endereco.value ? endereco.value.trim() : null,
        email: email.value ? email.value.trim() : null,
        salario: salarioNumber
      }
      await updateOne(id, payload as any)
      await fetchAll()
      success('Funcionário atualizado com sucesso!')
      router.push('/')
    } catch (e: any) {
      toastError(e?.message || 'Erro ao atualizar funcionário.')
    }
  }
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="onSubmit">
    <AppInput id="func-nome" v-model="nome" label="Nome" placeholder="Nome completo" required />
    <AppDropdown
      id="func-cargo"
      v-model="cargo"
      label="Cargo"
      placeholder="Selecione o cargo"
      required
      :options="[
        'Diretor Executivo (CEO)',
        'Gerente de Vendas',
        'Analista Financeiro',
        'Coordenador de Marketing',
        'Desenvolvedor de Software',
        'Engenheiro Civil',
        'Médico Clínico Geral',
        'Professor de Educação Física',
        'Assistente Administrativo',
        'Técnico de Suporte'
      ]"
    />
    <div class="relative">
      <AppInput
        id="func-endereco"
        v-model="endereco"
        label="Endereço"
        placeholder="Rua, nº, bairro"
        required
        @focus="onEnderecoFocus"
        @blur="onEnderecoBlur"
        @input="onEnderecoUserInput"
      />
      <div
        v-if="showAddressSuggestions && (addressSuggestions.length > 0 || isSearchingAddress)"
        class="absolute z-30 mt-1 w-full rounded-md border border-border bg-surface shadow-lg"
      >
        <div v-if="isSearchingAddress" class="px-3 py-2 text-sm text-muted-foreground">Buscando...</div>
        <ul v-else>
          <li
            v-for="s in addressSuggestions"
            :key="s"
            class="cursor-pointer px-3 py-2 text-sm text-foreground hover:bg-muted"
            @mousedown.prevent="selectAddress(s)"
          >
            {{ s }}
          </li>
        </ul>
      </div>
    </div>
    <AppInput id="func-email" v-model="email" type="email" label="E-mail" placeholder="voce@exemplo.com" required />
    <p v-if="emailError" class="-mt-2 text-sm text-destructive">{{ emailError }}</p>
    <AppCurrencyInput id="func-salario" v-model="salario" label="Salário" placeholder="R$ 0,00" required />

    <div class="pt-2">
      <AppButton type="submit" class="w-full">
        {{ props.isnovo ? 'Salvar' : 'Editar' }}
      </AppButton>
    </div>
  </form>
</template>


