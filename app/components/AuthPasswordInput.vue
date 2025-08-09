<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    id?: string
    disabled?: boolean
  }>(),
  { placeholder: '', disabled: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const inputClasses =
  'block w-full rounded-md border border-border bg-surface px-3 py-2 pr-10 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-transparent focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed'
const labelClasses = 'mb-1 block text-sm font-medium text-foreground'

const showPassword = ref(false)

function toggle() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="relative w-full">
    <label v-if="label" :for="props.id" :class="labelClasses">{{ label }}</label>
    <input
      :id="props.id"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :value="props.modelValue"
      :class="inputClasses"
      @input="onInput"
    />
    <button
      type="button"
      class="absolute bottom-2 right-2 rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      @click="toggle"
      aria-label="Mostrar/ocultar senha"
    >
      <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/><path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5"><path d="M2.1 3.51 3.52 2.1l18.38 18.38-1.41 1.41-3.14-3.14A11.6 11.6 0 0 1 12 19c-7 0-10-7-10-7a19.1 19.1 0 0 1 4.13-5.36L2.1 3.5Zm9.9 3.49c7 0 10 7 10 7a19.1 19.1 0 0 1-3.3 4.49l-2.2-2.2A5 5 0 0 0 9.7 8.8l-2-2A11.6 11.6 0 0 1 12 7Z"/></svg>
    </button>
  </div>
</template>


