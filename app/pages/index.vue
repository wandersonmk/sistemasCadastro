<script setup lang="ts">
import FuncionariosTable from '~/components/FuncionariosTable.vue'
import { useFuncionarios } from '~/composables/useFuncionarios'

definePageMeta({ layout: 'default' })

const { funcionarios, isLoading, errorMessage, fetchAll } = useFuncionarios()

onMounted(async () => {
  try {
    await fetchAll()
  } catch {
    // erro já está em errorMessage
  }
})
</script>

<template>
  <section class="mx-auto max-w-7xl p-6 grid gap-6">
    <h1 class="text-xl font-semibold text-foreground">Lista de Funcionários</h1>
    <FuncionariosTable :items="funcionarios" :is-loading="isLoading" :error-message="errorMessage" />
  </section>
</template>

