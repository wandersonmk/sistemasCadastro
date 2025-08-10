<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    type?: string
    label?: string
    placeholder?: string
    id?: string
    disabled?: boolean
  }>(),
  { type: 'text', placeholder: '', disabled: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number): void }>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
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
      :type="props.type"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :value="props.modelValue as any"
      :class="inputClasses"
      v-bind="$attrs"
      @input="onInput"
    />
  </div>
</template>


