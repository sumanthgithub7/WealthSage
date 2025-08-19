import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

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
    'professional': '/dashboard/other', 
    'homemaker': '/dashboard/other',
    'elderly': '/dashboard/other',
    'adult': '/dashboard/other',
    'elder': '/dashboard/other'
  };
  
  return roleMap[roleLower] || '/dashboard/student';
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        setLoading(true);
        
        // Check if user is already authenticated (from localStorage)
        const userData = authService.getCurrentUser();
        if (userData) {
          setCurrentUser(userData.user);
          setUserProfile(userData.user);
          console.log('Existing session found:', userData.user.email);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Session check error:', error);
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Get user role
  const getUserRole = () => {
    return userProfile?.role || 'Student';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Get user display name
  const getDisplayName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return userProfile?.display_name || currentUser?.email || 'User';
  };

  // Sign up function - Using only backend database
  async function signup(email, password, firstName, lastName, role) {
    try {
      setError('');
      setLoading(true);
      
      console.log('Starting signup process for:', email);
      
      // Use backend authentication service
      const result = await authService.signup({
        email,
        password,
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || 'Student'
      });
      
      console.log('Signup successful:', result.user);
      
      // Set user data
      setCurrentUser(result.user);
      setUserProfile(result.user);
      
      return result;
      
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Login function - Using only backend database
  async function login(email, password) {
    try {
      setError('');
      setLoading(true);
      
      console.log('Starting login process for:', email);
      
      // Use backend authentication service
      const result = await authService.signin(email, password);
      
      console.log('Login successful:', result.user);
      
      // Set user data
      setCurrentUser(result.user);
      setUserProfile(result.user);
      
      return result;
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Logout function
  async function logout() {
    try {
      setError('');
      
      // Logout from backend
      await authService.signout();
      
      // Clear local state
      setCurrentUser(null);
      setUserProfile(null);
      
      console.log('Logout successful');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setCurrentUser(null);
      setUserProfile(null);
    }
  }

  // Reset password function
  async function resetPassword(email) {
    try {
      setError('');
      await authService.resetPassword(email);
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message);
      throw error;
    }
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    getUserRole,
    isAuthenticated,
    getDisplayName,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
