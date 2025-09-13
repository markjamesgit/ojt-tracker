<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 300px">
      <h3 class="text-center">Sign Up</h3>

      <q-input v-model="name" label="Full Name" outlined class="q-mb-md" />
      <q-input v-model="email" label="Email" outlined class="q-mb-md" />
      <q-input v-model="password" label="Password" type="password" outlined class="q-mb-md" />

      <q-select v-model="role" :options="roles" label="Role" outlined class="q-mb-md" />

      <q-btn label="Sign Up" color="primary" class="full-width" @click="onSignup" />
      <q-banner v-if="message" class="q-mt-md bg-blue text-white">
        {{ message }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { registerUser } from '@/services/auth'

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('student')
const roles = ['student', 'adviser']
const message = ref('')

async function onSignup() {
  try {
    await registerUser(email.value, password.value, role.value, name.value)
    message.value = 'Signup successful! Check your email for verification.'
  } catch (err) {
    message.value = err.message
  }
}
</script>
