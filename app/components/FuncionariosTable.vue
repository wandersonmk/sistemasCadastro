<script setup lang="ts">
import type { Funcionario } from '~/types/funcionarios'
import AppButton from '~/components/AppButton.vue'
import AppModal from '~/components/AppModal.vue'
import AppInput from '~/components/AppInput.vue'
import { useFuncionarios } from '~/composables/useFuncionarios'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  items: Funcionario[]
  isLoading?: boolean
  errorMessage?: string | null
}>()

const router = useRouter()

function goEdit(id: number) {
  router.push(`/funcionario/${id}`)
}

const { deleteOne, fetchAll, isLoading: isBusy } = useFuncionarios()
const { success, error } = useToast()

const showConfirm = ref(false)
const selectedId = ref<number | null>(null)
const selectedName = ref('')

function openConfirm(item: Funcionario) {
  selectedId.value = item.id
  selectedName.value = item.nome
  showConfirm.value = true
}

async function confirmDelete() {
  const id = selectedId.value
  showConfirm.value = false
  if (!id) return
  try {
    await deleteOne(id)
    await fetchAll()
    success('Funcionário excluído com sucesso!')
  } catch (e: any) {
    error(e?.message || 'Erro ao excluir funcionário.')
  } finally {
    selectedId.value = null
    selectedName.value = ''
  }
}

const searchQuery = ref('')
const filteredItems = computed<Funcionario[]>(() => {
  const q = searchQuery.value.trim().toLocaleLowerCase()
  if (!q) return props.items || []
  return (props.items || []).filter((i) => i.nome.toLocaleLowerCase().includes(q))
})
</script>

<template>
  <!-- Filtro -->
  <div class="mb-3">
    <AppInput
      id="filtro-nome"
      v-model="searchQuery"
      placeholder="Filtrar por nome"
      label="Filtro"
    />
  </div>

  <!-- Desktop table -->
  <div class="w-full rounded-lg border border-border bg-surface max-h-[60vh] overflow-auto hidden md:block">
    <table class="min-w-full divide-y divide-border">
      <thead>
        <tr>
          <th class="sticky top-0 z-20 bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground">Nome</th>
          <th class="sticky top-0 z-20 bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground">Cargo</th>
          <th class="sticky top-0 z-20 bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground">E-mail</th>
          <th class="sticky top-0 z-20 bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground">Ações</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        <tr v-if="isLoading">
          <td class="px-4 py-4 text-sm text-muted-foreground" colspan="4">Carregando...</td>
        </tr>
        <tr v-else-if="errorMessage">
          <td class="px-4 py-4 text-sm text-destructive" colspan="4">{{ errorMessage }}</td>
        </tr>
        <tr v-else-if="!filteredItems || filteredItems.length === 0">
          <td class="px-4 py-4 text-sm text-muted-foreground" colspan="4">Nenhum funcionário encontrado.</td>
        </tr>
        <tr v-else v-for="item in filteredItems" :key="item.id">
          <td class="px-4 py-3 text-sm text-foreground">{{ item.nome }}</td>
          <td class="px-4 py-3 text-sm text-foreground">{{ item.cargo }}</td>
          <td class="px-4 py-3 text-sm text-foreground">{{ item.email || '-' }}</td>
          <td class="px-4 py-3 text-sm text-foreground">
            <div class="flex items-center gap-2">
              <AppButton size="sm" variant="secondary" @click="goEdit(item.id)">Editar</AppButton>
              <AppButton
                size="sm"
                variant="destructive"
                class="inline-flex items-center gap-2"
                aria-label="Excluir"
                @click="openConfirm(item)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
                Excluir
              </AppButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Mobile list -->
  <div class="md:hidden">
    <div v-if="isLoading" class="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">Carregando...</div>
    <div v-else-if="errorMessage" class="rounded-lg border border-border bg-surface p-4 text-sm text-destructive">{{ errorMessage }}</div>
    <div v-else-if="!filteredItems || filteredItems.length === 0" class="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">Nenhum funcionário encontrado.</div>
    <ul v-else class="grid gap-3">
      <li v-for="item in filteredItems" :key="item.id" class="rounded-lg border border-border bg-surface p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-medium text-foreground truncate">{{ item.nome }}</p>
            <p class="text-xs text-muted-foreground truncate">{{ item.cargo }}</p>
            <p class="mt-1 text-xs text-muted-foreground truncate">{{ item.email || '-' }}</p>
          </div>
          <div class="flex flex-col gap-2 shrink-0">
            <AppButton size="sm" variant="secondary" class="px-3" @click="goEdit(item.id)">Editar</AppButton>
            <AppButton size="sm" variant="destructive" class="px-3" @click="openConfirm(item)">Excluir</AppButton>
          </div>
        </div>
      </li>
    </ul>
  </div>

  <!-- Confirm modal (shared) -->
  <AppModal
    v-model="showConfirm"
    :title="'Excluir funcionário'"
    :description="`Tem certeza que deseja excluir ${selectedName}? Esta ação não pode ser desfeita.`"
    confirm-text="Excluir"
    cancel-text="Cancelar"
    :danger="true"
    @confirm="confirmDelete"
  />
</template>


