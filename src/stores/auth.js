import { auth, db } from '../firebase/index'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

// === SIGNUP ===
export async function registerUser(email, password, role = 'student', name = '') {
  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Send email verification (skip if superadmin)
  if (role !== 'superadmin') {
    await sendEmailVerification(user)
  }

  // Save user data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    role,
    name,
  })

  return user
}

// === LOGIN ===
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Get role from Firestore
  const docRef = doc(db, 'users', user.uid)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) {
    throw new Error('User profile not found.')
  }
  const userData = docSnap.data()

  // Block login if email not verified (except superadmin)
  if (!user.emailVerified && userData.role !== 'superadmin') {
    throw new Error('Please verify your email before logging in.')
  }

  return { uid: user.uid, email: user.email, role: userData.role, name: userData.name }
}

// === LOGOUT ===
export async function logoutUser() {
  await signOut(auth)
}

// === RESEND VERIFICATION EMAIL ===
export async function resendVerificationEmail(user) {
  if (user && !user.emailVerified) {
    await sendEmailVerification(user)
  }
}
