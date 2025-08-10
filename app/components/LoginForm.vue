<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'
import AuthPasswordInput from '~/components/AuthPasswordInput.vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const loginEmail = ref('')
const loginPassword = ref('')

const signupEmail = ref('')
const signupPassword = ref('')
const signupConfirm = ref('')

const { login, signup, isLoading } = useAuth()
const router = useRouter()

// Validações simples de formulário (login)
const emailError = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const submitError = ref<string | null>(null)

// Validações simples de formulário (signup)
const signupEmailError = ref<string | null>(null)
const signupPasswordError = ref<string | null>(null)
const signupConfirmError = ref<string | null>(null)
const signupSubmitError = ref<string | null>(null)
const signupSubmitInfo = ref<string | null>(null)

function isValidEmail(value: string): boolean {
  // Regex básica e suficiente para validação de formato
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value)
}

async function handleLogin() {
  // limpa erros anteriores
  emailError.value = null
  passwordError.value = null
  submitError.value = null

  // validações
  if (!isValidEmail(loginEmail.value)) {
    emailError.value = 'E-mail inválido.'
  }
  if (!loginPassword.value) {
    passwordError.value = 'Informe sua senha.'
  }
  if (emailError.value || passwordError.value) return

  try {
    await login({ email: loginEmail.value, password: loginPassword.value })
    submitError.value = null
    router.push('/')
  } catch (err: any) {
    // mensagem amigável para credenciais incorretas
    submitError.value = err?.message || 'E-mail ou senha incorretos.'
  }
}

async function handleSignup() {
  // limpa erros anteriores
  signupEmailError.value = null
  signupPasswordError.value = null
  signupConfirmError.value = null
  signupSubmitError.value = null
  signupSubmitInfo.value = null

  // validações
  if (!isValidEmail(signupEmail.value)) {
    signupEmailError.value = 'E-mail inválido.'
  }
  if (!signupPassword.value || signupPassword.value.length < 6) {
    signupPasswordError.value = 'Senha deve ter ao menos 6 caracteres.'
  }
  if (signupPassword.value !== signupConfirm.value) {
    signupConfirmError.value = 'As senhas não coincidem.'
  }
  if (signupEmailError.value || signupPasswordError.value || signupConfirmError.value) return

  try {
    const result = await signup({ email: signupEmail.value, password: signupPassword.value })
    // Independente do status de confirmação de e-mail,
    // se temos um usuário retornado, consideramos sucesso e redirecionamos.
    if (result.user) {
      router.push('/')
      return
    }
    // Fallback: tenta login e redireciona
    await login({ email: signupEmail.value, password: signupPassword.value })
    router.push('/')
    return
  } catch (err: any) {
    signupSubmitError.value = err?.message || 'Falha no cadastro.'
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-md">
    <div class="rounded-2xl bg-gradient-to-br from-brand-500/50 via-brand-500/10 to-ink-900/30 p-[1px] shadow-xl">
      <div class="rounded-2xl border border-border bg-surface/90 p-6 sm:p-8 backdrop-blur-md">
        <!-- Header visual -->
        <div class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold shadow">
            SC
          </span>
          <div>
            <h2 class="text-lg font-semibold text-foreground">Bem-vindo</h2>
            <p class="text-sm text-muted-foreground">Acesse sua conta ou crie uma nova</p>
          </div>
        </div>

        <TabGroup>
          <TabList class="mt-6 grid grid-cols-2 rounded-lg border border-border bg-surface p-1">
            <Tab v-slot="{ selected }">
              <button
                :class="[
                  'w-full rounded-md px-4 py-2 text-sm font-medium transition-all',
                  selected
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-foreground hover:bg-muted'
                ]"
              >
                Entrar
              </button>
            </Tab>
            <Tab v-slot="{ selected }">
              <button
                :class="[
                  'w-full rounded-md px-4 py-2 text-sm font-medium transition-all',
                  selected
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-foreground hover:bg-muted'
                ]"
              >
                Criar conta
              </button>
            </Tab>
          </TabList>

          <TabPanels class="mt-6">
            <!-- Entrar -->
            <TabPanel>
              <form class="grid gap-4" @submit.prevent="handleLogin">
                <AppInput
                  id="login-email"
                  v-model="loginEmail"
                  type="email"
                  label="E-mail"
                  placeholder="voce@exemplo.com"
                />
                <p v-if="emailError" class="-mt-2 text-sm text-destructive">{{ emailError }}</p>
                <AuthPasswordInput
                  id="login-password"
                  v-model="loginPassword"
                  label="Senha"
                  placeholder="••••••••"
                />
                <p v-if="passwordError" class="-mt-2 text-sm text-destructive">{{ passwordError }}</p>
                <AppButton :disabled="isLoading" type="submit" class="w-full">
                  {{ isLoading ? 'Entrando...' : 'Entrar' }}
                </AppButton>
                <p v-if="!isLoading && submitError" class="text-sm text-destructive">{{ submitError }}</p>
              </form>
            </TabPanel>

            <!-- Criar conta -->
            <TabPanel>
              <form class="grid gap-4" @submit.prevent="handleSignup">
                <AppInput
                  id="signup-email"
                  v-model="signupEmail"
                  type="email"
                  label="E-mail"
                  placeholder="voce@exemplo.com"
                />
                <p v-if="signupEmailError" class="-mt-2 text-sm text-destructive">{{ signupEmailError }}</p>
                <AuthPasswordInput
                  id="signup-password"
                  v-model="signupPassword"
                  label="Senha"
                  placeholder="••••••••"
                />
                <p v-if="signupPasswordError" class="-mt-2 text-sm text-destructive">{{ signupPasswordError }}</p>
                <AuthPasswordInput
                  id="signup-confirm"
                  v-model="signupConfirm"
                  label="Confirmar senha"
                  placeholder="••••••••"
                />
                <p v-if="signupConfirmError" class="-mt-2 text-sm text-destructive">{{ signupConfirmError }}</p>
                <AppButton :disabled="isLoading" type="submit" class="w-full">
                  {{ isLoading ? 'Criando...' : 'Criar conta' }}
                </AppButton>
                <p v-if="!isLoading && signupSubmitError" class="text-sm text-destructive">{{ signupSubmitError }}</p>
                <p v-if="!isLoading && signupSubmitInfo" class="text-sm text-emerald-500">{{ signupSubmitInfo }}</p>
              </form>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </div>
</template>


