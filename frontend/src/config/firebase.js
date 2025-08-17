import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration (real project values)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else {
    app = getApp();
    console.log('Using existing Firebase instance');
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw new Error('Failed to initialize Firebase: ' + error.message);
}

// Auth, Firestore, and Provider exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign In Function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // First time user - create profile
      const userData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: "user", // default role
        createdAt: serverTimestamp(),
        photoURL: user.photoURL,
        lastLogin: serverTimestamp()
      };

      // Store in Firestore
      await setDoc(userRef, userData);

      // Store in SQL via backend API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to store user data in SQL database');
        }
      } catch (error) {
        console.error("Error storing user in SQL:", error);
        // Continue since Firestore storage was successful
      }
    } else {
      // Update last login for existing user
      await setDoc(userRef, {
        lastLogin: serverTimestamp()
      }, { merge: true });
    }

    return user;
  } catch (error) {
    console.error("Error during Google sign in:", error);
    throw error;
  }
};

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support persistence.');
    }
});

// Optional: Analytics (only in supported browser environments)
export let analytics;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // ignore analytics init errors in unsupported environments
    });
}

export default app;
