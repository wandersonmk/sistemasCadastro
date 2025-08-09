<script setup lang="ts">
// Header principal do site com navegação
</script>

<template>
  <header class="bg-ink-900 border-b border-ink-800 text-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">A</span>
        <span class="font-semibold">Sistema de Cadastro</span>
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
        <li>
          <NuxtLink to="/login" class="text-sm text-ink-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring rounded px-2 py-1">
            Login
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>


