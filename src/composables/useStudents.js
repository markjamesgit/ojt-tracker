import { ref } from 'vue'
import { db } from 'src/firebase'
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore'

export default function useStudents() {
  const students = ref([])

  // Fetch all students
  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, 'students'))
    students.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  }

  // Manually verify a student
  const verifyStudent = async (uid) => {
    const studentRef = doc(db, 'students', uid)
    await updateDoc(studentRef, { isVerified: true })
    await fetchStudents() // refresh
  }

  // Add a new student
  const addStudent = async (studentData) => {
    const studentRef = doc(db, 'students', studentData.uid)
    await setDoc(studentRef, studentData)
    await fetchStudents()
  }

  return {
    students,
    fetchStudents,
    verifyStudent,
    addStudent,
  }
}
