<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout, isLoading } = useAuth()
const userEmail = computed(() => (user?.value?.email as string | undefined) ?? '')
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<template>
  <header class="bg-ink-900 border-b border-ink-800 text-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">A</span>
        <div class="flex flex-col leading-tight">
          <span class="font-semibold">Sistema de Cadastro</span>
          <span v-if="userEmail" class="text-xs text-ink-300">{{ userEmail }}</span>
        </div>
      </div>

      <ul class="flex items-center gap-4">
        <li>
          <NuxtLink to="/" class="text-sm text-ink-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1">
            Início
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/novo-cadastro" class="text-sm text-ink-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1">
            Novo cadastro
          </NuxtLink>
        </li>
        <li v-if="!user">
          <NuxtLink to="/login" class="text-sm text-ink-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1">
            Login
          </NuxtLink>
        </li>
        <template v-else>
          <li>
            <button @click="handleLogout" :disabled="isLoading" class="text-sm text-ink-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1">
              {{ isLoading ? 'Saindo...' : 'Sair' }}
            </button>
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>


