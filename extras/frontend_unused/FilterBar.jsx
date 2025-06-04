import React, { useState, useCallback } from 'react';
import { Filter, SortAsc, SortDesc, Calendar, DollarSign, Star } from 'lucide-react';

const FilterBar = React.memo(({ 
  onSortChange, 
  onFilterChange, 
  currentSort = 'relevance',
  currentFilters = {},
  totalCount = 0,
  displayedCount = 0
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant', icon: Star },
    { value: 'deadline', label: 'Deadline', icon: Calendar },
    { value: 'amount', label: 'Amount', icon: DollarSign },
    { value: 'newest', label: 'Newest First', icon: SortDesc },
    { value: 'oldest', label: 'Oldest First', icon: SortAsc }
  ];

  const filterOptions = [
    {
      key: 'deadline',
      label: 'Deadline',
      options: [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'Next 3 Months' },
        { value: 'none', label: 'No Deadline' }
      ]
    },
    {
      key: 'amount',
      label: 'Amount Range',
      options: [
        { value: 'low', label: 'Under $1,000' },
        { value: 'medium', label: '$1,000 - $5,000' },
        { value: 'high', label: '$5,000 - $10,000' },
        { value: 'very-high', label: 'Over $10,000' }
      ]
    },
    {
      key: 'difficulty',
      label: 'Difficulty',
      options: [
        { value: 'beginner', label: 'Beginner Friendly' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
      ]
    }
  ];

  const handleSortChange = useCallback((sortValue) => {
    onSortChange(sortValue);
  }, [onSortChange]);

  const handleFilterChange = useCallback((filterKey, filterValue) => {
    const newFilters = { ...currentFilters };
    if (newFilters[filterKey] === filterValue) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = filterValue;
    }
    onFilterChange(newFilters);
  }, [currentFilters, onFilterChange]);

  const clearAllFilters = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);

  const activeFilterCount = Object.keys(currentFilters).length;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/30 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Results Count */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{displayedCount}</span> of{' '}
            <span className="font-semibold text-gray-900">{totalCount}</span> opportunities
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear filters ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex items-center space-x-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <SortAsc className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`
              relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${isFilterOpen || activeFilterCount > 0
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filterOptions.map((filterGroup) => (
              <div key={filterGroup.key} className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {filterGroup.label}
                </label>
                <div className="space-y-1">
                  {filterGroup.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange(filterGroup.key, option.value)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                        ${currentFilters[filterGroup.key] === option.value
                          ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar;
