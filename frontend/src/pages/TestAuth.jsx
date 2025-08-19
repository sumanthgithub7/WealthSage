import React, { useState } from 'react';
import authService from '../services/authService';

const TestAuth = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, status, message, data = null) => {
    setResults(prev => [...prev, { test, status, message, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const result = await authService.testConnection();
      addResult('Connection Test', 'success', 'API is reachable', result);
    } catch (error) {
      addResult('Connection Test', 'error', error.message);
    }
    setLoading(false);
  };

  const testSignup = async () => {
    setLoading(true);
    try {
      const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User',
        role: 'Student'
      };
      
      const result = await authService.signup(testUser);
      addResult('Signup Test', 'success', 'User created successfully', result.user);
    } catch (error) {
      addResult('Signup Test', 'error', error.message);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const result = await authService.signin('test@student.com', 'testpass123');
      addResult('Login Test', 'success', 'Login successful', result.user);
    } catch (error) {
      addResult('Login Test', 'error', error.message);
    }
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Authentication Test Suite</h1>
          
          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Test Connection
            </button>
            
            <button
              onClick={testSignup}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Test Signup
            </button>
            
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Test Login
            </button>
            
            <button
              onClick={clearResults}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Clear Results
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Running test...</span>
            </div>
          )}

          {/* Results */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Test Results:</h2>
            
            {results.length === 0 ? (
              <p className="text-gray-500 italic">No tests run yet. Click a test button above to start.</p>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      result.status === 'success'
                        ? 'bg-green-50 border-green-500'
                        : 'bg-red-50 border-red-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{result.test}</h3>
                      <span className="text-sm text-gray-500">{result.timestamp}</span>
                    </div>
                    
                    <p className={`text-sm ${
                      result.status === 'success' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.status === 'success' ? '✅' : '❌'} {result.message}
                    </p>
                    
                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* API Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">API Configuration:</h3>
            <p className="text-sm text-gray-600">
              <strong>Backend URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:8000'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Frontend URL:</strong> {window.location.origin}
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </a>
            <a
              href="/auth/signup"
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Go to Signup →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
