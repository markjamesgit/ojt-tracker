<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 300px">
      <h3 class="text-center">Login</h3>

      <q-input v-model="email" label="Email" outlined class="q-mb-md" />
      <q-input v-model="password" label="Password" type="password" outlined class="q-mb-md" />

      <q-btn label="Login" color="primary" class="full-width" @click="onLogin" />

      <q-btn flat label="Resend verification email" class="q-mt-sm" @click="resendEmail" />

      <q-banner v-if="message" class="q-mt-md bg-red text-white">
        {{ message }}
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { loginUser, resendVerificationEmail } from '../../stores/auth'
import { auth } from '../../firebase/index'

const email = ref('')
const password = ref('')
const message = ref('')
let currentUser = null

async function onLogin() {
  try {
    const user = await loginUser(email.value, password.value)
    message.value = `Login successful! Welcome ${user.name}`

    // Redirect based on role
    if (user.role === 'superadmin') {
      window.location.href = '/dashboard/admin'
    } else if (user.role === 'adviser') {
      window.location.href = '/dashboard/adviser'
    } else {
      window.location.href = '/dashboard/student'
    }
  } catch (err) {
    message.value = err.message
  }
}

async function resendEmail() {
  if (!currentUser) currentUser = auth.currentUser
  if (currentUser) {
    await resendVerificationEmail(currentUser)
    message.value = 'Verification email resent!'
  } else {
    message.value = 'Please try logging in first.'
  }
}
</script>
