import { auth, db } from '../firebase/index'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

/**
 * === REGISTER USER ===
 * Admin can add student/adviser manually.
 */
export async function registerUser(email, password, role = 'student', name = '') {
  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Send email verification only for student/adviser
  if (role !== 'superadmin') {
    await sendEmailVerification(user, {
      url: 'http://localhost:9000/verify-email', // update this for production
    })
  }

  // Save user profile in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    role,
    name,
    isActive: true,
    isVerified: role === 'superadmin' ? true : false, // auto verify superadmin
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return user
}

/**
 * === LOGIN USER ===
 */
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Get Firestore profile
  const docRef = doc(db, 'users', user.uid)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) throw new Error('User profile not found.')

  const userData = docSnap.data()

  // Check if user is active
  if (!userData.isActive) {
    throw new Error('Your account has been deactivated.')
  }

  // Admin verification check (manual verification)
  if (!userData.isVerified && userData.role !== 'superadmin') {
    throw new Error('Your account is not verified by the admin yet.')
  }

  // Email verification check (only if not manually verified by admin)
  if (!user.emailVerified && !userData.isVerified && userData.role !== 'superadmin') {
    throw new Error('Please verify your email first.')
  }

  return { uid: user.uid, email: user.email, role: userData.role, name: userData.name }
}

/**
 * === LOGOUT ===
 */
export async function logoutUser() {
  await signOut(auth)
}

/**
 * === RESEND VERIFICATION EMAIL ===
 * FRONTEND-ONLY: You can only send email verification to currently signed-in user.
 * For manually added users, use manual "isVerified" in Firestore.
 */
export async function resendVerificationEmail(currentUser) {
  if (!currentUser) throw new Error('No user is logged in.')
  if (!currentUser.emailVerified) {
    await sendEmailVerification(currentUser, {
      url: 'http://localhost:9000/verify-email',
    })
  }
}

/**
 * === DEACTIVATE/REACTIVATE USER ===
 * Toggle user active status
 */
export async function toggleUserStatus(uid, isActive) {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    isActive,
    updatedAt: serverTimestamp(),
  })
}

/**
 * === ADMIN RESEND VERIFICATION EMAIL ===
 * Admin can resend verification email for any user
 * This requires the user's current password or admin privileges
 */
export async function adminResendVerificationEmail(userEmail, userPassword) {
  try {
    // Sign in as the user to get their Firebase Auth instance
    const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword)
    const user = userCredential.user

    // Send verification email
    await sendEmailVerification(user, {
      url: `${window.location.origin}/verify-email`,
    })

    // Sign out the user
    await signOut(auth)

    return true
  } catch (error) {
    throw new Error(`Failed to resend verification email: ${error.message}`)
  }
}
