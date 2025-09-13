<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md text-center" style="max-width: 400px; width: 100%">
      <h3>Email Verification</h3>

      <div v-if="loading">
        <q-spinner color="primary" size="50px" />
        <p>Verifying your email...</p>
      </div>

      <div v-else>
        <q-banner v-if="success" class="bg-green text-white q-mb-md">
          ✅ Your email has been verified successfully!
        </q-banner>

        <q-banner v-else class="bg-red text-white q-mb-md">
          ❌ Verification failed. Please request a new verification email.
        </q-banner>

        <q-btn label="Go to Login" color="primary" @click="goLogin" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAuth, applyActionCode } from 'firebase/auth'

const router = useRouter()
const route = useRoute()
const auth = getAuth()

const loading = ref(true)
const success = ref(false)

onMounted(async () => {
  const oobCode = route.query.oobCode

  if (!oobCode) {
    loading.value = false
    success.value = false
    return
  }

  try {
    await applyActionCode(auth, oobCode) // Verify email using Firebase
    success.value = true
  } catch (error) {
    console.error('Verification error:', error)
    success.value = false
  } finally {
    loading.value = false
  }
})

function goLogin() {
  router.push('/login')
}
</script>
