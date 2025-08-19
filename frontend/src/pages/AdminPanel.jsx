import React, { useState } from 'react';
import { Download, Users, FileSpreadsheet, RefreshCw } from 'lucide-react';

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const exportUsers = async () => {
    setLoading(true);
    setError('');
    setExportResult(null);

    try {
      const response = await fetch(`${API_URL}/api/admin/export-users`);
      
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }

      const data = await response.json();
      setExportResult(data);
      
      // Auto-download the file
      if (data.download_url) {
        const downloadUrl = `${API_URL}${data.download_url}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.file_path.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    } catch (err) {
      console.error('Export error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (downloadUrl, filename) => {
    const fullUrl = `${API_URL}${downloadUrl}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                Admin Panel
              </h1>
              <p className="text-gray-600 mt-2">Manage users and export data</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">WealthSage</p>
              <p className="text-xs text-gray-400">User Management</p>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Export Users to Excel
            </h2>
            
            <p className="text-gray-600 mb-6">
              Export all user data including profiles, roles, and financial information to an Excel file 
              with multiple sheets for easy analysis.
            </p>

            <div className="flex gap-4">
              <button
                onClick={exportUsers}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export All Users
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Export Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {exportResult && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-green-800">Export Successful!</h3>
                  <p className="text-sm text-green-700 mt-1">{exportResult.message}</p>
                  
                  {exportResult.download_url && (
                    <div className="mt-3">
                      <button
                        onClick={() => downloadFile(exportResult.download_url, exportResult.file_path.split('/').pop())}
                        className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">📊 Excel Features</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Complete user profiles and data</li>
                <li>• Multiple sheets (Users, Summary, Statistics)</li>
                <li>• Professional formatting and styling</li>
                <li>• Auto-generated on every signup</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">🔒 Data Included</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• User registration details</li>
                <li>• Role and university information</li>
                <li>• Financial goals and savings</li>
                <li>• Registration and login timestamps</li>
              </ul>
            </div>
          </div>

          {/* File Location Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">📁 File Storage</h3>
            <p className="text-sm text-gray-600">
              Excel files are automatically saved to the <code className="bg-gray-200 px-1 rounded">user_exports/</code> directory 
              on the server. A master file <code className="bg-gray-200 px-1 rounded">wealthsage_all_users.xlsx</code> is 
              updated every time a new user signs up.
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
              href="/test-auth"
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Test Authentication →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
