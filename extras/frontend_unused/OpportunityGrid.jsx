import React, { useMemo, useState } from 'react';
import OpportunityCard from './OpportunityCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import FilterBar from './FilterBar';

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
  const [currentSort, setCurrentSort] = useState('relevance');
  const [currentFilters, setCurrentFilters] = useState({});

  // Sort and filter opportunities
  const processedOpportunities = useMemo(() => {
    let filtered = [...opportunities];

    // Apply filters (placeholder logic - can be enhanced)
    if (currentFilters.deadline) {
      // Filter by deadline logic would go here
    }
    if (currentFilters.amount) {
      // Filter by amount logic would go here
    }
    if (currentFilters.difficulty) {
      // Filter by difficulty logic would go here
    }

    // Apply sorting
    switch (currentSort) {
      case 'deadline':
        filtered.sort((a, b) => {
          if (!a.deadline || a.deadline === 'Not specified') return 1;
          if (!b.deadline || b.deadline === 'Not specified') return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        });
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.published_date || 0) - new Date(a.published_date || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.published_date || 0) - new Date(b.published_date || 0));
        break;
      case 'relevance':
      default:
        filtered.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));
        break;
    }

    return filtered;
  }, [opportunities, currentSort, currentFilters]);
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {processedOpportunities.map((opportunity, index) => (
            <div
              key={`${opportunity.title}-${opportunity.source}-${index}`}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
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
          <div className="flex justify-center pt-4">
            <button
              onClick={onLoadMore}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl
                         transition-all duration-300 ease-in-out transform hover:scale-105
                         focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-offset-2
                         shadow-lg hover:shadow-xl"
            >
              <span>Load More {category}</span>
              <svg
                className="ml-3 h-5 w-5 transition-transform group-hover:translate-y-1"
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
