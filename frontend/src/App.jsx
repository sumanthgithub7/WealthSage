import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import './style.css';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const ProfessionalDashboard = lazy(() => import('./pages/ProfessionalDashboard'));
const HomemakerDashboard = lazy(() => import('./pages/HomemakerDashboard'));
const ElderlyDashboard = lazy(() => import('./pages/ElderlyDashboard'));
const OtherRolesDashboard = lazy(() => import('./pages/OtherRolesDashboard'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl animate-pulse">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading WealthSage...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <RoleBasedRedirect>
                  <LandingPage />
                </RoleBasedRedirect>
              } />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />

              {/* Demo Routes - No Authentication Required */}
              <Route path="/demo/student" element={<StudentDashboard />} />
              <Route path="/demo/professional" element={<ProfessionalDashboard />} />
              <Route path="/demo/homemaker" element={<HomemakerDashboard />} />
              <Route path="/demo/elderly" element={<ElderlyDashboard />} />
              <Route path="/demo/other" element={<OtherRolesDashboard />} />

              {/* Protected Routes - Role-Based Dashboards */}
              <Route path="/dashboard/student" element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/professional" element={
                <ProtectedRoute>
                  <ProfessionalDashboard />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/homemaker" element={
                <ProtectedRoute>
                  <HomemakerDashboard />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/elderly" element={
                <ProtectedRoute>
                  <ElderlyDashboard />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/elder" element={
                <ProtectedRoute>
                  <ElderlyDashboard />
                </ProtectedRoute>
              } />

              <Route path="/dashboard/adult" element={
                <ProtectedRoute>
                  <ProfessionalDashboard />
                </ProtectedRoute>
              } />

              {/* Fallback for other roles */}
              <Route path="/dashboard/other" element={
                <ProtectedRoute>
                  <OtherRolesDashboard />
                </ProtectedRoute>
              } />

              {/* Legacy redirect */}
              <Route path="/dashboard" element={<Navigate to="/dashboard/student" replace />} />

              {/* Catch all - redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
