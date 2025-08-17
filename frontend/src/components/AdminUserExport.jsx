import React, { useState } from 'react';

const AdminUserExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Trigger file download
      window.location.href = `${import.meta.env.VITE_API_URL}/api/export-users`;
      
      // Wait a bit before resetting loading state
      setTimeout(() => setLoading(false), 2000);
    } catch (err) {
      console.error('Export error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Export User Data
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Download all user data as Excel file
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleExport}
          disabled={loading}
          className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Excel...
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Users
            </span>
          )}
        </button>

        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Test Instructions:</h3>
          <ol className="mt-2 text-sm text-gray-600 list-decimal list-inside space-y-2">
            <li>Click the Export Users button</li>
            <li>Excel file will start downloading</li>
            <li>Check the file contains all user data</li>
            <li>Verify the formatting and columns</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminUserExport;
