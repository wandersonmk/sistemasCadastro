<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    danger?: boolean
  }>(),
  { confirmText: 'Confirmar', cancelText: 'Cancelar', danger: false }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function close() {
  emit('update:modelValue', false)
  emit('cancel')
}

function confirm() {
  emit('confirm')
}
</script>

<template>
  <teleport to="body">
    <div v-if="props.modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="close" />
      <div class="relative z-10 w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-xl">
        <h3 v-if="title" class="text-base font-semibold text-foreground">{{ title }}</h3>
        <p v-if="description" class="mt-2 text-sm text-muted-foreground">{{ description }}</p>
        <div class="mt-5 flex justify-end gap-2">
          <AppButton variant="ghost" size="sm" @click="close">{{ cancelText }}</AppButton>
          <AppButton
            :variant="danger ? 'destructive' : 'primary'"
            size="sm"
            class="" 
            @click="confirm"
          >
            {{ confirmText }}
          </AppButton>
        </div>
      </div>
    </div>
  </teleport>
</template>


