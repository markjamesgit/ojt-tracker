import { ref } from 'vue'
import { db } from 'src/firebase'
import { collection, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore'

export default function useManageUsers() {
  const students = ref([])
  const advisers = ref([])
  const verifyDialog = ref({ open: false, user: null })

  const columns = [
    { name: 'name', label: 'Name', field: 'name' },
    { name: 'email', label: 'Email', field: 'email' },
    { name: 'role', label: 'Role', field: 'role' },
    { name: 'isVerified', label: 'Verified', field: (row) => (row.isVerified ? 'Yes' : 'No') },
    { name: 'actions', label: 'Actions', field: 'actions' },
  ]

  async function loadUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'))
    const all = querySnapshot.docs.map((doc) => doc.data())
    students.value = all.filter((u) => u.role === 'student')
    advisers.value = all.filter((u) => u.role === 'adviser')
  }

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
      // We can't directly resend without their Firebase Auth user instance.
      // Best approach is to let them log in and handle verification via Firebase Auth.
      alert(`Verification email resend requires Firebase Auth instance for ${user.email}`)
    } catch (err) {
      console.error('Error resending email:', err.message)
    }
  }

  return {
    students,
    advisers,
    columns,
    verifyDialog,
    loadUsers,
    confirmManualVerify,
    doManualVerify,
    resendEmail,
  }
}
