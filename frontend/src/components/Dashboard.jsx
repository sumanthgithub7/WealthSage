import React, { useState, useCallback } from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import CategoryTabs from './CategoryTabs';
import OpportunityGrid from './OpportunityGrid';
import { useOpportunities } from '../hooks/useOpportunities';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CATEGORIES = ['Scholarships', 'Hackathons', 'Freelancing'];

const Dashboard = React.memo(() => {
  const [activeCategory, setActiveCategory] = useState('Scholarships');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedOpportunities, setSavedOpportunities] = useLocalStorage('savedOpportunities', []);

  // Use custom hook for opportunities data
  const {
    opportunities,
    loading,
    error,
    refresh,
    loadMore,
    hasMore,
    hasData,
    totalCount,
    displayedCount
  } = useOpportunities(activeCategory, searchQuery);

  // Handle category change
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setSearchQuery(''); // Clear search when changing category
  }, []);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Handle save opportunity
  const handleSaveOpportunity = useCallback((opportunity) => {
    setSavedOpportunities(prev => {
      const isAlreadySaved = prev.some(saved =>
        saved.title === opportunity.title && saved.source === opportunity.source
      );

      if (isAlreadySaved) {
        // Remove from saved
        return prev.filter(saved =>
          !(saved.title === opportunity.title && saved.source === opportunity.source)
        );
      } else {
        // Add to saved
        return [...prev, { ...opportunity, savedAt: new Date().toISOString() }];
      }
    });
  }, [setSavedOpportunities]);

  // Check if opportunity is saved
  const isOpportunitySaved = useCallback((opportunity) => {
    return savedOpportunities.some(saved =>
      saved.title === opportunity.title && saved.source === opportunity.source
    );
  }, [savedOpportunities]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WealthSage Student Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover scholarships, hackathons, and freelancing opportunities tailored for students
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder={`Search ${activeCategory.toLowerCase()}...`}
          />
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <CategoryTabs
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Opportunities Grid */}
        <OpportunityGrid
          opportunities={opportunities}
          loading={loading}
          error={error}
          category={activeCategory}
          onSave={handleSaveOpportunity}
          isOpportunitySaved={isOpportunitySaved}
          onRefresh={refresh}
          onLoadMore={loadMore}
          hasMore={hasMore}
          hasData={hasData}
          searchQuery={searchQuery}
          totalCount={totalCount}
          displayedCount={displayedCount}
        />
      </main>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
