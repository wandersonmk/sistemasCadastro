<script setup lang="ts">
import AppButton from '~/components/AppButton.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    email?: string
  }>(),
  { email: '' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

function close() {
  emit('update:modelValue', false)
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
        <div class="flex items-start gap-3">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shrink-0">@</span>
          <div>
            <h3 class="text-base font-semibold text-foreground">Confirme seu e-mail</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              Enviamos um link de confirmação para <span class="font-medium">{{ email || 'seu e-mail' }}</span>.
              Acesse sua caixa de entrada e confirme para poder entrar no sistema.
            </p>
          </div>
        </div>
        <div class="mt-5 flex justify-end gap-2">
          <AppButton variant="primary" size="sm" @click="confirm">Ok, entendi</AppButton>
        </div>
      </div>
    </div>
  </teleport>
</template>


