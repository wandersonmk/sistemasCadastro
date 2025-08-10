<script setup lang="ts">
import FormFuncionario from '~/components/FormFuncionario.vue'
import AppButton from '~/components/AppButton.vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useFuncionarios } from '~/composables/useFuncionarios'
import type { Funcionario } from '~/types/funcionarios'

definePageMeta({ layout: 'default' })

const route = useRoute()
const router = useRouter()
const idParam = computed(() => Number(route.params.id))

const { funcionarios, fetchById } = useFuncionarios()

const initial = computed<Partial<Funcionario> | null>(() => {
  const id = idParam.value
  if (!Number.isFinite(id)) return null
  return funcionarios.value.find((f) => Number(f.id) === id) || null
})

onMounted(async () => {
  const id = idParam.value
  if (Number.isFinite(id) && !initial.value) {
    await fetchById(id)
  }
})
</script>

<template>
  <section class="mx-auto w-full max-w-2xl p-6">
    <div class="mb-4 flex items-center justify-between">
      <!-- Mobile: ícone -->
      <AppButton
        variant="ghost"
        size="sm"
        class="h-9 w-9 p-0 rounded-full md:hidden"
        aria-label="Voltar"
        @click="router.push('/')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </AppButton>
      <!-- Desktop: botão com texto -->
      <AppButton variant="secondary" size="sm" class="hidden md:inline-flex items-center gap-2" @click="router.push('/')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Voltar
      </AppButton>
      <h1 class="text-xl font-semibold text-foreground">Editar funcionário</h1>
    </div>
    <div class="rounded-lg border border-border bg-surface p-4">
      <FormFuncionario :isnovo="false" :initial="initial || undefined" />
      <p v-if="!initial" class="mt-3 text-sm text-muted-foreground">Carregue a lista ou navegue a partir da listagem para pré-preencher.</p>
    </div>
  </section>
</template>


