<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px; width: 100%">
      <h3>Resend Verification Email</h3>

      <q-input v-model="email" label="Email" type="email" outlined class="q-mb-md" />

      <q-btn
        label="Send Verification Email"
        color="primary"
        class="full-width"
        :loading="loading"
        @click="resend"
      />

      <q-banner
        v-if="message"
        class="q-mt-md"
        :class="success ? 'bg-green text-white' : 'bg-red text-white'"
      >
        {{ message }}
      </q-banner>

      <q-btn label="Back to Login" flat color="primary" class="q-mt-md" @click="goLogin" />
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import {
  getAuth,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import { useRouter } from 'vue-router'

const auth = getAuth()
const router = useRouter()

const email = ref('')
const message = ref('')
const success = ref(false)
const loading = ref(false)

async function resend() {
  if (!email.value) {
    message.value = 'Please enter your email.'
    success.value = false
    return
  }

  loading.value = true
  try {
    // Check if account exists
    const methods = await fetchSignInMethodsForEmail(auth, email.value)
    if (methods.length === 0) {
      throw new Error('No account found with this email.')
    }

    // Temporary login just to resend email
    // ⚠️ In production, you may want to handle differently
    const password = prompt('Enter your password to confirm your identity:')
    if (!password) throw new Error('Password required.')

    const userCredential = await signInWithEmailAndPassword(auth, email.value, password)
    await sendEmailVerification(userCredential.user, {
      url: 'http://localhost:9000/verify-email', // same as before
    })

    message.value = 'Verification email sent. Please check your inbox.'
    success.value = true
  } catch (err) {
    console.error(err)
    message.value = err.message
    success.value = false
  } finally {
    loading.value = false
  }
}

function goLogin() {
  router.push('/login')
}
</script>
