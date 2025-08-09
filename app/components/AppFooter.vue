<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-ink-900 border-t border-ink-800 text-ink-200">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-sm">
      <p class="text-ink-300">&copy; {{ year }} Sistema de Cadastro</p>
      <p>
        <a href="#" class="hover:text-primary">Termos</a>
        <span class="mx-2 text-ink-500">•</span>
        <a href="#" class="hover:text-primary">Privacidade</a>
      </p>
    </div>
  </footer>
</template>


