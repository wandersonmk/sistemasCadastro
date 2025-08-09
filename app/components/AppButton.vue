<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false
  }
)

const baseClasses =
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed'

const sizeClasses = computed(() => ({
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base'
}[props.size]))

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-secondary text-secondary-foreground hover:bg-ink-800'
    case 'ghost':
      return 'bg-transparent text-foreground hover:bg-muted'
    default:
      return 'bg-primary text-primary-foreground hover:bg-brand-700'
  }
})
</script>

<template>
  <button :type="props.type" :disabled="props.disabled" :class="[baseClasses, sizeClasses, variantClasses]">
    <slot />
  </button>
  
</template>


