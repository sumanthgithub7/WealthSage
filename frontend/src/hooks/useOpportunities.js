import { useState, useEffect, useCallback, useMemo } from 'react';
import { opportunitiesAPI } from '../services/api';
import { useDebounce } from './useDebounce';

/**
 * Custom hook for managing opportunities data
 * @param {string} category - Current category
 * @param {string} searchQuery - Search query
 * @returns {object} - Opportunities data and methods
 */
export function useOpportunities(category, searchQuery) {
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [displayedOpportunities, setDisplayedOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const ITEMS_PER_PAGE = 10;

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoized cache key
  const cacheKey = useMemo(() =>
    `${category}-${debouncedSearchQuery || 'all'}`,
    [category, debouncedSearchQuery]
  );

  // Fetch opportunities function
  const fetchOpportunities = useCallback(async (cat, query = '') => {
    const key = `${cat}-${query || 'all'}`;

    // Check cache first
    if (cache[key]) {
      console.log(`Using cached data for ${key}`);
      const cachedData = cache[key];
      setAllOpportunities(cachedData);
      setCurrentPage(1);
      setDisplayedOpportunities(cachedData.slice(0, ITEMS_PER_PAGE));
      setHasMore(cachedData.length > ITEMS_PER_PAGE);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (query) {
        data = await opportunitiesAPI.searchOpportunities(cat, query);
      } else {
        data = await opportunitiesAPI.getOpportunities(cat);
      }

      const opportunitiesData = data.opportunities || [];
      setAllOpportunities(opportunitiesData);
      setCurrentPage(1);
      setDisplayedOpportunities(opportunitiesData.slice(0, ITEMS_PER_PAGE));
      setHasMore(opportunitiesData.length > ITEMS_PER_PAGE);

      // Update cache
      setCache(prev => ({
        ...prev,
        [key]: opportunitiesData
      }));

    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError(err.message);
      setAllOpportunities([]);
      setDisplayedOpportunities([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Effect to fetch data when category or search query changes
  useEffect(() => {
    if (category) {
      fetchOpportunities(category, debouncedSearchQuery);
    }
  }, [category, debouncedSearchQuery, fetchOpportunities]);

  // Load more function
  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const filteredData = debouncedSearchQuery
      ? allOpportunities.filter(opportunity =>
          opportunity.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          opportunity.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          opportunity.source?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        )
      : allOpportunities;

    const newItems = filteredData.slice(0, endIndex);
    setDisplayedOpportunities(newItems);
    setCurrentPage(nextPage);
    setHasMore(newItems.length < filteredData.length);
  }, [currentPage, allOpportunities, debouncedSearchQuery, ITEMS_PER_PAGE]);

  // Refresh function
  const refresh = useCallback(() => {
    // Clear cache for current category
    setCache(prev => {
      const newCache = { ...prev };
      Object.keys(newCache).forEach(key => {
        if (key.startsWith(category)) {
          delete newCache[key];
        }
      });
      return newCache;
    });

    setCurrentPage(1);
    fetchOpportunities(category, debouncedSearchQuery);
  }, [category, debouncedSearchQuery, fetchOpportunities]);

  // Filter opportunities based on search query (client-side filtering as backup)
  const filteredOpportunities = useMemo(() => {
    if (!debouncedSearchQuery) return displayedOpportunities;

    const filtered = allOpportunities.filter(opportunity =>
      opportunity.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      opportunity.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      opportunity.source?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    // Reset pagination when search changes
    const paginatedFiltered = filtered.slice(0, currentPage * ITEMS_PER_PAGE);
    setHasMore(paginatedFiltered.length < filtered.length);

    return paginatedFiltered;
  }, [displayedOpportunities, allOpportunities, debouncedSearchQuery, currentPage, ITEMS_PER_PAGE]);

  // Update displayed opportunities when search changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      const filtered = allOpportunities.filter(opportunity =>
        opportunity.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        opportunity.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        opportunity.source?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setCurrentPage(1);
      setDisplayedOpportunities(filtered.slice(0, ITEMS_PER_PAGE));
      setHasMore(filtered.length > ITEMS_PER_PAGE);
    } else {
      setCurrentPage(1);
      setDisplayedOpportunities(allOpportunities.slice(0, ITEMS_PER_PAGE));
      setHasMore(allOpportunities.length > ITEMS_PER_PAGE);
    }
  }, [debouncedSearchQuery, allOpportunities, ITEMS_PER_PAGE]);

  return {
    opportunities: filteredOpportunities,
    loading,
    error,
    refresh,
    loadMore,
    hasMore,
    hasData: filteredOpportunities.length > 0,
    totalCount: allOpportunities.length,
    displayedCount: filteredOpportunities.length
  };
}
