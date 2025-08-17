import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, enableNetwork, disableNetwork } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

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

      // Check if it's a 400 error (Firestore security rules issue)
      if (error.code === 'permission-denied' || error.message.includes('400')) {
        console.warn('Firestore access denied - this might be due to security rules');
        // Return null instead of throwing - let the app continue
        return null;
      }

      if (i === retries - 1) {
        // Last attempt failed, but don't throw for Firestore issues
        console.warn('Failed to fetch user profile after retries, continuing without profile');
        return null;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Backend API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Google Auth function
  async function signInWithGoogle(role = 'user') {
    try {
      setError('');
      setLoading(true);
      
      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Get ID token for backend verification
      const idToken = await user.getIdToken();
      
      // Send to backend for dual database storage
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: idToken,
          role: role
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to authenticate with backend');
      }
      
      const data = await response.json();
      
      // Store user profile in Firestore
      const userProfile = {
        uid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        displayName: user.displayName,
        role: role,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userProfile);
        setUserProfile(userProfile);
        console.log('User profile stored in Firestore');
      } catch (firestoreError) {
        console.error('Firestore error during Google signup:', firestoreError);
        // Don't fail signup if Firestore is down - user can still sign in
        // Profile will be created when they next sign in or when Firestore is available
        console.warn('Continuing with signup despite Firestore error');
      }
      
      return { user, profile: userProfile, isNewUser: data.isNewUser };
      
    } catch (error) {
      console.error('Google Auth error:', error);
      let errorMessage = 'Failed to sign in with Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in was cancelled';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Sign in popup was blocked. Please allow popups for this site';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with the same email address but different sign-in credentials';
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

  // Forgot Password function
  async function forgotPassword(email) {
    try {
      setError('');
      setLoading(true);

      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email);

      console.log('Password reset email sent to:', email);
      return { success: true, message: 'Password reset email sent successfully!' };

    } catch (error) {
      console.error('Forgot password error:', error);
      let errorMessage = 'Failed to send password reset email';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
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

  // Reset password function (existing - unchanged)
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
    signInWithGoogle,
    loading,
    error,
    setError,
    getDashboardUrl,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
