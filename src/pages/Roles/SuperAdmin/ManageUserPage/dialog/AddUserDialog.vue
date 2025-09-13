<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Add User</div>

        <q-input v-model="email" label="Email" outlined class="q-mb-md" />
        <q-input v-model="name" label="Name" outlined class="q-mb-md" />
        <q-select v-model="role" :options="roles" label="Role" outlined class="q-mb-md" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="closeDialog" />
        <q-btn flat label="Add" color="primary" @click="addUser" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { registerUser } from 'src/stores/auth'

defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'userAdded'])

const email = ref('')
const name = ref('')
const role = ref('student')
const roles = ['student', 'adviser', 'superadmin']

// Close the dialog
function closeDialog() {
  emit('update:modelValue', false)
}

// Add user
async function addUser() {
  if (!email.value || !name.value) return
  try {
    const user = await registerUser(email.value, 'defaultPassword123', role.value, name.value)
    emit('userAdded', user) // Notify parent
    closeDialog()
  } catch (err) {
    console.error(err)
  }
}
</script>
