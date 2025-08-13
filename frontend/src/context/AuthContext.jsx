import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, enableNetwork, disableNetwork } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Utility function to get dashboard URL based on role
export const getDashboardUrl = (role) => {
  if (!role) return '/dashboard/student'; // default fallback
  
  // Convert role to lowercase for URL mapping
  const roleLower = role.toLowerCase();
  
  // Map roles to dashboard URLs
  const roleMap = {
    'student': '/dashboard/student',
    'professional': '/dashboard/professional', 
    'homemaker': '/dashboard/homemaker',
    'elderly': '/dashboard/elderly',
    'adult': '/dashboard/adult',
    'elder': '/dashboard/elder'
  };
  
  return roleMap[roleLower] || '/dashboard/student';
};

// Helper function to fetch user profile with retry logic
const fetchUserProfile = async (uid, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      // Enable network connection
      await enableNetwork(db);
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed to fetch user profile:`, error);
      
      if (i === retries - 1) {
        // Last attempt failed, throw error
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sign up function
  async function signup(email, password, firstName, lastName, role) {
    try {
      setError('');
      setLoading(true);
      
      // Create user account
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Create user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userProfile);
        setUserProfile(userProfile);
      } catch (firestoreError) {
        console.error('Firestore error during signup:', firestoreError);
        // Don't fail signup if Firestore is down, user can still sign in
        // Profile will be created when they next sign in
      }
      
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Login function
  async function login(email, password) {
    try {
      setError('');
      setLoading(true);
      
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile from Firestore with retry logic
      try {
        const profileData = await fetchUserProfile(user.uid);
        setUserProfile(profileData);
        return { user, profile: profileData };
      } catch (firestoreError) {
        console.error('Failed to fetch user profile:', firestoreError);
        // Continue with login even if profile fetch fails
        return { user, profile: null };
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to log in';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Logout function
  async function logout() {
    try {
      setError('');
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to log out');
    }
  }

  // Reset password function
  async function resetPassword(email) {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Reset password error:', error);
      let errorMessage = 'Failed to reset password';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Fetch user profile from Firestore with retry logic
        try {
          const profileData = await fetchUserProfile(user.uid);
          setUserProfile(profileData);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Don't fail auth state change if profile fetch fails
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    resetPassword,
    loading,
    error,
    setError,
    getDashboardUrl
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
