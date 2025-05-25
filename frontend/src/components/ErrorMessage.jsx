import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = React.memo(({ 
  message, 
  onRetry, 
  category = 'opportunities' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        {/* Error Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>

        {/* Error Message */}
        <p className="text-gray-600 mb-6">
          {message || `We couldn't load the ${category}. Please try again.`}
        </p>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>

        {/* Additional Help */}
        <div className="mt-6 text-sm text-gray-500">
          <p>If the problem persists, please:</p>
          <ul className="mt-2 space-y-1">
            <li>• Check your internet connection</li>
            <li>• Refresh the page</li>
            <li>• Try again in a few minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
