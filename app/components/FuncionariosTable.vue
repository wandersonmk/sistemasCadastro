<script setup lang="ts">
import type { Funcionario } from '~/types/funcionarios'

const props = defineProps<{
  items: Funcionario[]
  isLoading?: boolean
  errorMessage?: string | null
}>()
</script>

<template>
  <div class="w-full rounded-lg border border-border bg-surface max-h-[60vh] overflow-auto">
    <table class="min-w-full divide-y divide-border">
      <thead>
        <tr>
          <th class="sticky top-0 z-20 bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground">Nome</th>
          <th class="sticky top-0 z-20 bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground">Cargo</th>
          <th class="sticky top-0 z-20 bg-surface px-4 py-3 text-left text-sm font-semibold text-foreground">E-mail</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        <tr v-if="isLoading">
          <td class="px-4 py-4 text-sm text-muted-foreground" colspan="3">Carregando...</td>
        </tr>
        <tr v-else-if="errorMessage">
          <td class="px-4 py-4 text-sm text-destructive" colspan="3">{{ errorMessage }}</td>
        </tr>
        <tr v-else-if="!items || items.length === 0">
          <td class="px-4 py-4 text-sm text-muted-foreground" colspan="3">Nenhum funcionário encontrado.</td>
        </tr>
        <tr v-else v-for="item in items" :key="item.id">
          <td class="px-4 py-3 text-sm text-foreground">{{ item.nome }}</td>
          <td class="px-4 py-3 text-sm text-foreground">{{ item.cargo }}</td>
          <td class="px-4 py-3 text-sm text-foreground">{{ item.email || '-' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


