import { defineNuxtPlugin } from '#app'
import { Toaster } from 'vue-sonner'
import { createApp, h } from 'vue'
import 'vue-sonner/style.css'

export default defineNuxtPlugin(() => {
  // Evita múltiplas montagens em HMR/navegações
  const id = 'vue-sonner-toaster'
  let container = document.getElementById(id)
  if (!container) {
    container = document.createElement('div')
    container.id = id
    document.body.appendChild(container)
    createApp({ render: () => h(Toaster, { position: 'top-right', richColors: true }) }).mount(container)
  }
})


