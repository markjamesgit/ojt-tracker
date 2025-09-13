<template>
  <q-page padding>
    <h3>Manage Users</h3>

    <q-btn color="primary" label="Add User" @click="showAddDialog = true" class="q-mb-md" />

    <q-tabs v-model="tab" dense class="text-primary q-mb-md" align="left" narrow-indicator>
      <q-tab name="students" label="Students" />
      <q-tab name="advisers" label="Advisers" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <!-- Students Tab -->
      <q-tab-panel name="students">
        <q-table :rows="students" :columns="columns" row-key="uid" flat bordered>
          <template v-slot:body-cell-actions="props">
            <q-td>
              <q-btn
                dense
                size="sm"
                color="green"
                flat
                label="Verify"
                v-if="!props.row.isVerified"
                @click="confirmManualVerify(props.row)"
              />
              <q-btn
                dense
                size="sm"
                color="blue"
                flat
                label="Email Help"
                @click="resendEmail(props.row)"
              />
              <q-btn
                dense
                size="sm"
                :color="props.row.isActive ? 'orange' : 'green'"
                flat
                :label="props.row.isActive ? 'Deactivate' : 'Activate'"
                @click="toggleUserStatus(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <!-- Advisers Tab -->
      <q-tab-panel name="advisers">
        <q-table :rows="advisers" :columns="columns" row-key="uid" flat bordered>
          <template v-slot:body-cell-actions="props">
            <q-td>
              <q-btn
                dense
                size="sm"
                color="green"
                flat
                label="Verify"
                v-if="!props.row.isVerified"
                @click="confirmManualVerify(props.row)"
              />
              <q-btn
                dense
                size="sm"
                color="blue"
                flat
                label="Email Help"
                @click="resendEmail(props.row)"
              />
              <q-btn
                dense
                size="sm"
                :color="props.row.isActive ? 'orange' : 'green'"
                flat
                :label="props.row.isActive ? 'Deactivate' : 'Activate'"
                @click="toggleUserStatus(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Manual Verify Dialog -->
    <q-dialog v-model="verifyDialog.open">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirm Verification</div>
          <div>Are you sure you want to verify {{ verifyDialog.user?.name }}?</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Verify" color="green" @click="doManualVerify" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add User Dialog -->
    <q-dialog v-model="showAddDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add User</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="newUser.name"
            label="Name"
            outlined
            class="q-mb-sm"
            :rules="[(val) => !!val || 'Name is required']"
          />
          <q-input
            v-model="newUser.email"
            label="Email"
            outlined
            class="q-mb-sm"
            type="email"
            :rules="[
              (val) => !!val || 'Email is required',
              (val) => /.+@.+\..+/.test(val) || 'Invalid email',
            ]"
          />
          <q-input
            v-model="newUser.password"
            label="Password"
            type="password"
            outlined
            class="q-mb-sm"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 6 || 'Password must be at least 6 characters',
            ]"
          />
          <q-select
            v-model="newUser.role"
            :options="['student', 'adviser']"
            label="Role"
            outlined
            class="q-mb-sm"
            :rules="[(val) => !!val || 'Role is required']"
          />
          <q-checkbox
            v-model="newUser.autoVerify"
            label="Auto-verify user (skip email verification)"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add" color="primary" @click="addUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from 'src/firebase'
import { collection, getDocs, updateDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { toggleUserStatus as toggleStatus } from 'src/stores/auth'

const tab = ref('students')
const students = ref([])
const advisers = ref([])
const columns = [
  { name: 'name', label: 'Name', field: 'name' },
  { name: 'email', label: 'Email', field: 'email' },
  { name: 'role', label: 'Role', field: 'role' },
  { name: 'isVerified', label: 'Verified', field: (row) => (row.isVerified ? 'Yes' : 'No') },
  { name: 'isActive', label: 'Active', field: (row) => (row.isActive ? 'Yes' : 'No') },
  { name: 'actions', label: 'Actions', field: 'actions' },
]

const verifyDialog = ref({ open: false, user: null })
const showAddDialog = ref(false)
const newUser = ref({ name: '', email: '', password: '', role: '', autoVerify: false })

async function loadUsers() {
  const querySnapshot = await getDocs(collection(db, 'users'))
  const all = querySnapshot.docs.map((doc) => doc.data())
  students.value = all.filter((u) => u.role === 'student')
  advisers.value = all.filter((u) => u.role === 'adviser')
}
onMounted(loadUsers)

function confirmManualVerify(user) {
  verifyDialog.value = { open: true, user }
}

async function doManualVerify() {
  if (!verifyDialog.value.user) return
  const userRef = doc(db, 'users', verifyDialog.value.user.uid)
  await updateDoc(userRef, { isVerified: true, updatedAt: serverTimestamp() })
  verifyDialog.value.open = false
  await loadUsers()
}

async function resendEmail(user) {
  try {
    // For manually verified users, we don't need to resend email verification
    if (user.isVerified) {
      alert(`${user.name} is already manually verified by admin. No email verification needed.`)
      return
    }

    // Show instructions for email verification
    const message = `
For ${user.name} (${user.email}):

Option 1: Manual Verification (Recommended)
- Click the "Verify" button to manually verify this user
- This will allow them to login without email verification

Option 2: Email Verification
- The user needs to login with their credentials
- They will be prompted to verify their email
- Or they can check their email for the verification link

Note: Admin cannot resend verification emails directly due to Firebase security restrictions.
    `

    alert(message)
  } catch (err) {
    console.error('Error resending email:', err)
    alert(`Error: ${err.message}`)
  }
}

async function addUser() {
  try {
    // Validate required fields
    if (
      !newUser.value.name ||
      !newUser.value.email ||
      !newUser.value.password ||
      !newUser.value.role
    ) {
      alert('Please fill in all required fields')
      return
    }

    const cred = await createUserWithEmailAndPassword(
      auth,
      newUser.value.email,
      newUser.value.password,
    )
    const uid = cred.user.uid

    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      uid,
      name: newUser.value.name,
      email: newUser.value.email,
      role: newUser.value.role,
      isActive: true,
      isVerified: newUser.value.autoVerify, // Use autoVerify setting
      emailVerified: false, // Firebase email verification status
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Send email verification only if not auto-verified
    if (!newUser.value.autoVerify) {
      await sendEmailVerification(cred.user, {
        url: `${window.location.origin}/verify-email`,
      })
    }

    // Reset form and close dialog
    newUser.value = { name: '', email: '', password: '', role: '', autoVerify: false }
    showAddDialog.value = false
    await loadUsers()

    alert(`User ${newUser.value.name} added successfully!`)
  } catch (err) {
    console.error('Error adding user:', err)
    alert(`Error adding user: ${err.message}`)
  }
}

async function toggleUserStatus(user) {
  try {
    const newStatus = !user.isActive
    await toggleStatus(user.uid, newStatus)
    await loadUsers()
    alert(`User ${user.name} has been ${newStatus ? 'activated' : 'deactivated'}`)
  } catch (err) {
    console.error('Error toggling user status:', err)
    alert(`Error updating user status: ${err.message}`)
  }
}
</script>
