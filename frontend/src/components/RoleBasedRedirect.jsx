import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRedirect = ({ children }) => {
  const { currentUser, userProfile, loading, getDashboardUrl } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if user is logged in, profile is loaded, and not currently loading
    if (currentUser && userProfile && !loading) {
      const currentPath = window.location.pathname;
      
      // Check if user is already on their correct dashboard
      const correctDashboardUrl = getDashboardUrl(userProfile.role);
      
      // If user is not on their correct dashboard, redirect them
      if (currentPath !== correctDashboardUrl && !currentPath.startsWith('/dashboard/')) {
        navigate(correctDashboardUrl, { replace: true });
      }
    }
  }, [currentUser, userProfile, loading, navigate, getDashboardUrl]);

  // Show loading while checking authentication and profile
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleBasedRedirect; 