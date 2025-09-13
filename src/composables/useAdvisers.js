import { ref } from 'vue'
import { db } from 'src/firebase'
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore'

export default function useAdvisers() {
  const advisers = ref([])

  // Fetch all advisers
  const fetchAdvisers = async () => {
    const querySnapshot = await getDocs(collection(db, 'advisers'))
    advisers.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  }

  // Manually verify an adviser
  const verifyAdviser = async (uid) => {
    const adviserRef = doc(db, 'advisers', uid)
    await updateDoc(adviserRef, { isVerified: true })
    await fetchAdvisers()
  }

  // Add a new adviser
  const addAdviser = async (adviserData) => {
    const adviserRef = doc(db, 'advisers', adviserData.uid)
    await setDoc(adviserRef, adviserData)
    await fetchAdvisers()
  }

  return {
    advisers,
    fetchAdvisers,
    verifyAdviser,
    addAdviser,
  }
}
