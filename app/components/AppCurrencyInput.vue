<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    label?: string
    placeholder?: string
    id?: string
    disabled?: boolean
  }>(),
  { placeholder: 'R$ 0,00', disabled: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string | null): void }>()

const display = ref<string>('')

function formatBRLFromDigits(digits: string): string {
  const cents = Number(digits || '0') / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(cents)
}

function syncFromModel(val: string | number | null | undefined) {
  if (val === null || val === undefined || val === '') {
    display.value = ''
    return
  }
  const digits = String(val).replace(/\D/g, '')
  display.value = digits ? formatBRLFromDigits(digits) : ''
}

watch(
  () => props.modelValue,
  (val) => {
    // evita loop quando já está igual
    const nextDigits = String(val ?? '').replace(/\D/g, '')
    const currentDigits = display.value.replace(/\D/g, '')
    if (nextDigits !== currentDigits) {
      syncFromModel(val as any)
    }
  },
  { immediate: true }
)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '')
  if (!digits) {
    display.value = ''
    emit('update:modelValue', '')
    return
  }
  const formatted = formatBRLFromDigits(digits)
  display.value = formatted
  emit('update:modelValue', formatted)
}

function onKeyDown(event: KeyboardEvent) {
  const allowedControlKeys = new Set([
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    'Home',
    'End'
  ])
  if (allowedControlKeys.has(event.key)) return

  // Allow common shortcuts (copy, paste, cut, select all)
  if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
    return
  }

  // Only digits
  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault()
  }
}

const inputClasses =
  'block w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground placeholder:text-muted-foreground shadow-sm focus:border-transparent focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed'
const labelClasses = 'mb-1 block text-sm font-medium text-foreground'
</script>

<template>
  <div class="relative w-full">
    <label v-if="label" :for="props.id" :class="labelClasses">{{ label }}</label>
    <input
      :id="props.id"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :value="display"
      :class="inputClasses"
      v-bind="$attrs"
      @input="onInput"
      @keydown="onKeyDown"
    />
  </div>
</template>


