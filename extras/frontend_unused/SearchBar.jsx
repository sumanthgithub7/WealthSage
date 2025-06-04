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
    <div className="max-w-3xl mx-auto">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl
                     focus:ring-4 focus:ring-blue-100 focus:border-blue-400
                     bg-white text-gray-900 placeholder-gray-400
                     transition-all duration-300 ease-in-out
                     text-base shadow-sm hover:shadow-md
                     group-focus-within:shadow-lg"
        />

        {/* Clear Button */}
        {value && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-200
                         rounded-full hover:bg-gray-100 transform hover:scale-110"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Search Suggestions */}
        {!value && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
            <p className="text-sm text-gray-600 mb-3 font-medium">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['Programming', 'Scholarship', 'Remote Work', 'Design', 'Writing', 'Tutoring'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => onChange(tag.toLowerCase())}
                  className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-xs font-medium hover:from-blue-100 hover:to-purple-100 transition-all duration-200 transform hover:scale-105"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
