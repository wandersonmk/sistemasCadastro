<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

type Option = string | { label: string; value: string }

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    options: Option[]
    label?: string
    placeholder?: string
    id?: string
    disabled?: boolean
  }>(),
  { placeholder: 'Selecione', disabled: false }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string | null): void }>()

const normalizedOptions = computed(() =>
  props.options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : { label: opt.label, value: opt.value }
  )
)

const selectedValue = ref<string | null>(props.modelValue ?? null)

watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val ?? null
  }
)

watch(selectedValue, (val) => {
  emit('update:modelValue', val ?? null)
})

const selectedLabel = computed(() => {
  const match = normalizedOptions.value.find((o) => o.value === selectedValue.value)
  return match?.label ?? ''
})

const buttonClasses =
  'block w-full rounded-md border border-border bg-surface px-3 py-2 text-left text-foreground placeholder:text-muted-foreground shadow-sm focus:border-transparent focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed'
const labelClasses = 'mb-1 block text-sm font-medium text-foreground'
const optionsClasses =
  'absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-surface py-1 shadow-lg focus:outline-none'
</script>

<template>
  <div class="relative w-full">
    <label v-if="label" :for="props.id" :class="labelClasses">{{ label }}</label>
    <Listbox v-model="selectedValue" :disabled="props.disabled">
      <div class="relative">
        <ListboxButton :id="props.id" :class="buttonClasses" v-bind="$attrs">
          <span v-if="selectedLabel" class="block truncate">{{ selectedLabel }}</span>
          <span v-else class="block truncate text-muted-foreground">{{ props.placeholder }}</span>
        </ListboxButton>
        <ListboxOptions :class="optionsClasses">
          <ListboxOption
            v-for="opt in normalizedOptions"
            :key="opt.value"
            :value="opt.value"
            v-slot="{ active, selected }"
          >
            <li :class="['cursor-pointer select-none px-3 py-2 text-sm', active ? 'bg-muted' : '', selected ? 'font-medium' : 'font-normal', 'text-foreground']">
              {{ opt.label }}
            </li>
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
  </div>
  
</template>


