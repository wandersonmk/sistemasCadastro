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
    <nav class="mx-auto max-w-7xl px-4 py-3">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-2 min-w-0">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold shrink-0">A</span>
          <div class="flex min-w-0 flex-col leading-tight">
            <span class="font-semibold truncate">Sistema de Cadastro</span>
            <span v-if="userEmail" class="text-xs text-ink-300 truncate">{{ userEmail }}</span>
          </div>
        </div>

        <!-- Desktop nav -->
        <ul class="hidden md:flex items-center gap-4">
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
          <li v-else>
            <button @click="handleLogout" :disabled="isLoading" class="text-sm text-ink-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1">
              {{ isLoading ? 'Saindo...' : 'Sair' }}
            </button>
          </li>
        </ul>

        <!-- Mobile actions -->
        <div class="md:hidden flex items-center gap-2">
          <NuxtLink to="/novo-cadastro" class="inline-flex h-9 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground">
            Novo
          </NuxtLink>
          <button v-if="user" @click="handleLogout" :disabled="isLoading" class="inline-flex h-9 items-center rounded-md bg-ink-800 px-3 text-xs font-medium text-ink-200">
            {{ isLoading ? 'Saindo...' : 'Sair' }}
          </button>
          <NuxtLink v-else to="/login" class="inline-flex h-9 items-center rounded-md bg-ink-800 px-3 text-xs font-medium text-ink-200">
            Login
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>


