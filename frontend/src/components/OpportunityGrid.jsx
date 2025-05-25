import React, { useMemo } from 'react';
import OpportunityCard from './OpportunityCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';

const OpportunityGrid = React.memo(({
  opportunities,
  loading,
  error,
  category,
  onSave,
  isOpportunitySaved,
  onRefresh,
  onLoadMore,
  hasMore,
  hasData,
  searchQuery,
  totalCount,
  displayedCount
}) => {
  // Memoize the grid content to prevent unnecessary re-renders
  const gridContent = useMemo(() => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <ErrorMessage
          message={error}
          onRetry={onRefresh}
          category={category}
        />
      );
    }

    if (!hasData) {
      return (
        <EmptyState
          category={category}
          searchQuery={searchQuery}
          onRefresh={onRefresh}
        />
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity, index) => (
            <div
              key={`${opportunity.title}-${opportunity.source}-${index}`}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <OpportunityCard
                opportunity={opportunity}
                onSave={onSave}
                isSaved={isOpportunitySaved(opportunity)}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={onLoadMore}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700
                         text-white font-medium rounded-lg transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         shadow-sm hover:shadow-md"
            >
              <span>Load More {category}</span>
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  }, [
    loading,
    error,
    hasData,
    opportunities,
    category,
    searchQuery,
    onSave,
    isOpportunitySaved,
    onRefresh,
    onLoadMore,
    hasMore
  ]);

  return (
    <div className="w-full">
      {/* Results Summary */}
      {!loading && !error && hasData && (
        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {displayedCount} of {totalCount} {category.toLowerCase()}
            {searchQuery && (
              <span> matching "{searchQuery}"</span>
            )}
          </div>

          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Grid Content */}
      {gridContent}
    </div>
  );
});

OpportunityGrid.displayName = 'OpportunityGrid';

export default OpportunityGrid;
