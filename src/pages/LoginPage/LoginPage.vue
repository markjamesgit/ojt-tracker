<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="width: 300px">
      <h3 class="text-center">Login</h3>

      <q-input v-model="email" label="Email" outlined class="q-mb-md" />
      <q-input v-model="password" label="Password" type="password" outlined class="q-mb-md" />

      <q-btn label="Login" color="primary" class="full-width" @click="onLogin" />

      <q-banner v-if="message" class="q-mt-md bg-red text-white">
        {{ message }}
        <div v-if="message.includes('verify')">
          <!-- Button that calls goResend -->
          <q-btn flat label="Resend Verification Email" color="white" @click="goResend" />
        </div>
      </q-banner>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { loginUser } from '../../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const message = ref('')

async function onLogin() {
  try {
    const user = await loginUser(email.value, password.value)
    message.value = `Login successful! Welcome ${user.name}`

    // Redirect based on role
    if (user.role === 'superadmin') {
      await router.push('/superadmin/dashboard')
    } else if (user.role === 'adviser') {
      await router.push('/adviser/dashboard')
    } else {
      await router.push('/student/dashboard')
    }
  } catch (err) {
    message.value = err.message
  }
}

function goResend() {
  router.push('/resend-verification')
}
</script>
