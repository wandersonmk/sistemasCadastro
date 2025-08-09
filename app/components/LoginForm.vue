<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'
import AuthPasswordInput from '~/components/AuthPasswordInput.vue'

const loginEmail = ref('')
const loginPassword = ref('')

const signupEmail = ref('')
const signupPassword = ref('')
const signupConfirm = ref('')
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
              <form class="grid gap-4">
                <AppInput
                  id="login-email"
                  v-model="loginEmail"
                  type="email"
                  label="E-mail"
                  placeholder="voce@exemplo.com"
                />
                <AuthPasswordInput
                  id="login-password"
                  v-model="loginPassword"
                  label="Senha"
                  placeholder="••••••••"
                />
                <AppButton type="button" class="w-full">Entrar</AppButton>
              </form>
            </TabPanel>

            <!-- Criar conta -->
            <TabPanel>
              <form class="grid gap-4">
                <AppInput
                  id="signup-email"
                  v-model="signupEmail"
                  type="email"
                  label="E-mail"
                  placeholder="voce@exemplo.com"
                />
                <AuthPasswordInput
                  id="signup-password"
                  v-model="signupPassword"
                  label="Senha"
                  placeholder="••••••••"
                />
                <AuthPasswordInput
                  id="signup-confirm"
                  v-model="signupConfirm"
                  label="Confirmar senha"
                  placeholder="••••••••"
                />
                <AppButton type="button" class="w-full">Criar conta</AppButton>
              </form>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  </div>
</template>


