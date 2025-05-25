import React, { useCallback } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = React.memo(({ value, onChange, placeholder = "Search opportunities..." }) => {
  // Handle input change
  const handleInputChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  // Handle clear search
  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  // Handle key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white text-gray-900 placeholder-gray-500
                     transition-colors duration-200
                     text-sm sm:text-base"
        />

        {/* Clear Button */}
        {value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200
                         rounded-full hover:bg-gray-100"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Search Tips */}
      {!value && (
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-500">
            Try searching for keywords like "programming", "scholarship", or "remote"
          </p>
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
