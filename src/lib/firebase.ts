import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { UserRole, UserProfile } from '../types';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes('YOUR_')
);

// Safe singleton initialization
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (typeof window !== 'undefined' || isFirebaseConfigured) {
  try {
    if (getApps().length === 0) {
      if (isFirebaseConfigured) {
        app = initializeApp(firebaseConfig);
      }
    } else {
      app = getApp();
    }
    if (app) {
      auth = getAuth(app);
      db = getFirestore(app);
    }
  } catch (err) {
    console.warn('Firebase initialization note:', err);
  }
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db };

/**
 * Maps Firebase auth error codes to clear user-friendly messages
 */
export function formatFirebaseError(error: any): string {
  if (!error) return 'An unknown error occurred.';
  const code = error.code || '';

  switch (code) {
    case 'auth/user-not-found':
      return 'No registered account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled before completion.';
    case 'auth/cancelled-popup-request':
      return 'Another authentication popup is already active.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to multiple failed attempts. Please reset your password or try again later.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google Sign-In. Add this domain to Authorized Domains in Firebase Console (Authentication > Settings > Authorized Domains).';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

/**
 * 1. Email & Password Sign In
 */
export async function firebaseSignIn(email: string, password: string) {
  if (!auth) {
    return { success: false, error: 'Firebase is not yet configured with valid credentials.' };
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    const user = userCredential.user;
    const profile = await fetchFirebaseUserProfile(user.uid, user.email || '');
    return { success: true, user, profile };
  } catch (error: any) {
    return { success: false, error: formatFirebaseError(error) };
  }
}

/**
 * 2. Email & Password Sign Up (Defaults strictly to 'user' for public signup)
 */
export async function firebaseSignUp(
  email: string, 
  password: string, 
  fullName?: string, 
  initialRole: UserRole = 'user'
) {
  if (!auth) {
    return { success: false, error: 'Firebase is not yet configured with valid credentials.' };
  }
  try {
    const cleanEmail = email.trim().toLowerCase();
    
    // Security Guard: Prevent any public client registration from assigning Admin role
    const safeRole: UserRole = initialRole === 'admin' ? 'user' : initialRole;

    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const user = userCredential.user;

    if (fullName) {
      await updateProfile(user, { displayName: fullName });
    }

    // Optional verification email
    try {
      await sendEmailVerification(user);
    } catch (e) {
      console.warn('Email verification dispatch note:', e);
    }

    // Store trusted user profile in Firestore
    const profile: UserProfile = {
      id: user.uid,
      email: cleanEmail,
      fullName: fullName || cleanEmail.split('@')[0],
      role: safeRole,
      createdAt: new Date().toISOString(),
      membershipStatus: safeRole === 'partner' || safeRole === 'instructor' ? 'pending' : 'active'
    };

    if (db) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: cleanEmail,
          fullName: profile.fullName,
          role: safeRole,
          membershipStatus: profile.membershipStatus,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore profile write note:', err);
      }
    }

    return { 
      success: true, 
      user, 
      profile, 
      requiresVerification: !user.emailVerified,
      message: 'Account registered successfully! A verification email has been dispatched.' 
    };
  } catch (error: any) {
    return { success: false, error: formatFirebaseError(error) };
  }
}

/**
 * 3. Google Sign-In with Popup
 */
export async function firebaseSignInWithGoogle() {
  if (!auth) {
    return { success: false, error: 'Firebase is not yet configured with valid credentials.' };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    let profile = await fetchFirebaseUserProfile(user.uid, user.email || '');

    // If new user, create default customer profile
    if (!profile) {
      const cleanEmail = (user.email || '').toLowerCase().trim();
      const isAdminEmail = cleanEmail === 'admin@yogaconnect.in';
      const role: UserRole = isAdminEmail ? 'admin' : 'user';

      profile = {
        id: user.uid,
        email: cleanEmail,
        fullName: user.displayName || cleanEmail.split('@')[0] || 'Traveler',
        avatarUrl: user.photoURL || '',
        role: role,
        createdAt: new Date().toISOString()
      };

      if (db) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: cleanEmail,
            fullName: profile.fullName,
            avatarUrl: profile.avatarUrl,
            role: role,
            createdAt: serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.warn('Firestore Google user write note:', e);
        }
      }
    }

    return { success: true, user, profile };
  } catch (error: any) {
    return { success: false, error: formatFirebaseError(error) };
  }
}

/**
 * 4. Password Reset
 */
export async function firebasePasswordReset(email: string) {
  if (!auth) {
    return { success: false, error: 'Firebase is not yet configured with valid credentials.' };
  }
  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    return { success: true, message: 'Password reset instructions have been sent to your email.' };
  } catch (error: any) {
    return { success: false, error: formatFirebaseError(error) };
  }
}

/**
 * 5. Sign Out
 */
export async function firebaseSignOut() {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase sign-out error:', error);
  }
}

/**
 * 6. Fetch User Profile from Firestore with Fallbacks & Security
 */
export async function fetchFirebaseUserProfile(uid: string, email: string): Promise<UserProfile | null> {
  const cleanEmail = email.toLowerCase().trim();

  // Root platform admin hard-lock
  if (cleanEmail === 'admin@yogaconnect.in') {
    return {
      id: uid,
      email: cleanEmail,
      fullName: 'Chief Administrator',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
  }

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: uid,
          email: cleanEmail,
          fullName: data.fullName || data.name || cleanEmail.split('@')[0],
          avatarUrl: data.avatarUrl || data.photoURL || '',
          role: data.role || 'user',
          assignedCentreId: data.assignedCentreId || null,
          assignedCentreName: data.assignedCentreName || null,
          membershipStatus: data.membershipStatus || 'active',
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn('Firestore profile read note:', err);
    }
  }

  return null;
}

/**
 * 7. Partner: Register Yoga Centre Owner (with Centre details)
 */
export async function firebaseRegisterCentreOwner(data: {
  centreName: string;
  ownerName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  state: string;
  styles: string[];
  description?: string;
  websiteUrl?: string;
}) {
  const cleanEmail = data.email.trim().toLowerCase();

  // 1. Create Firebase Auth user
  const authRes = await firebaseSignUp(cleanEmail, data.password, data.ownerName, 'partner');
  if (!authRes.success || !authRes.user) {
    return authRes;
  }

  const uid = authRes.user.uid;
  const centreId = `centre-${Date.now()}`;

  // 2. Persist in Firestore with pending verification status
  if (db) {
    try {
      // Create Centre Document
      await setDoc(doc(db, 'centres', centreId), {
        id: centreId,
        name: data.centreName,
        ownerUid: uid,
        ownerName: data.ownerName,
        ownerEmail: cleanEmail,
        phone: data.phone,
        city: data.city,
        state: data.state,
        styles: data.styles,
        description: data.description || '',
        websiteUrl: data.websiteUrl || '',
        status: 'pending',
        verified: false,
        createdAt: serverTimestamp()
      });

      // Update User Document
      await setDoc(doc(db, 'users', uid), {
        uid: uid,
        email: cleanEmail,
        fullName: data.ownerName,
        role: 'partner',
        assignedCentreId: centreId,
        assignedCentreName: data.centreName,
        membershipStatus: 'pending',
        phone: data.phone,
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore centre registration write error:', err);
    }
  }

  return {
    success: true,
    user: authRes.user,
    centreId,
    message: 'Yoga Centre Owner registration submitted! Your account is currently in pending admin verification.'
  };
}

/**
 * 8. Partner: Register Individual Yoga Instructor
 */
export async function firebaseRegisterInstructor(data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  state: string;
  styles: string[];
  bio?: string;
  experienceYears?: number;
}) {
  const cleanEmail = data.email.trim().toLowerCase();

  // 1. Create Firebase Auth user
  const authRes = await firebaseSignUp(cleanEmail, data.password, data.fullName, 'instructor');
  if (!authRes.success || !authRes.user) {
    return authRes;
  }

  const uid = authRes.user.uid;
  const instructorId = `instructor-${Date.now()}`;

  // 2. Persist in Firestore
  if (db) {
    try {
      // Create Instructor Document
      await setDoc(doc(db, 'instructors', instructorId), {
        id: instructorId,
        uid: uid,
        name: data.fullName,
        email: cleanEmail,
        phone: data.phone,
        city: data.city,
        state: data.state,
        styles: data.styles,
        bio: data.bio || '',
        experienceYears: data.experienceYears || 1,
        status: 'pending',
        verified: false,
        createdAt: serverTimestamp()
      });

      // Update User Document
      await setDoc(doc(db, 'users', uid), {
        uid: uid,
        email: cleanEmail,
        fullName: data.fullName,
        role: 'instructor',
        membershipStatus: 'pending',
        phone: data.phone,
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore instructor registration write error:', err);
    }
  }

  return {
    success: true,
    user: authRes.user,
    instructorId,
    message: 'Individual Yoga Instructor registration submitted! Your profile is currently awaiting admin verification.'
  };
}
