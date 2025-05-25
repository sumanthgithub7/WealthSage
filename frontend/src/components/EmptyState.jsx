import React from 'react';
import { Search, RefreshCw, BookOpen } from 'lucide-react';
import { getCategoryIcon } from '../utils/helpers';

const EmptyState = React.memo(({ 
  category, 
  searchQuery, 
  onRefresh 
}) => {
  const categoryIcon = getCategoryIcon(category);
  const isSearchResult = Boolean(searchQuery);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
          {isSearchResult ? (
            <Search className="h-8 w-8 text-gray-400" />
          ) : (
            <BookOpen className="h-8 w-8 text-gray-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isSearchResult 
            ? `No ${category.toLowerCase()} found`
            : `No ${category.toLowerCase()} available`
          }
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {isSearchResult ? (
            <>
              We couldn't find any {category.toLowerCase()} matching "{searchQuery}". 
              Try adjusting your search terms or browse all {category.toLowerCase()}.
            </>
          ) : (
            <>
              We're currently fetching the latest {category.toLowerCase()} for you. 
              Check back in a few minutes or try refreshing.
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 
                       text-white font-medium rounded-lg transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh {category}
          </button>

          {isSearchResult && (
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 
                         text-gray-800 font-medium rounded-lg transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="font-medium mb-2">💡 Tips for better results:</p>
          <ul className="text-left space-y-1">
            <li>• Try different keywords</li>
            <li>• Use broader search terms</li>
            <li>• Check other categories</li>
            <li>• Come back later for new opportunities</li>
          </ul>
        </div>

        {/* Category Suggestion */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <span className="text-lg mr-2">{categoryIcon}</span>
            Looking for {category.toLowerCase()}? We update our database regularly 
            with fresh opportunities from trusted sources.
          </p>
        </div>
      </div>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
