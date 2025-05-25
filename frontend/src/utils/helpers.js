/**
 * Utility functions for the application
 */

// Format date strings
export const formatDate = (dateString) => {
  if (!dateString || dateString === 'Not specified') return 'No deadline';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    'Scholarships': 'bg-green-100 text-green-800 border-green-200',
    'Hackathons': 'bg-purple-100 text-purple-800 border-purple-200',
    'Freelancing': 'bg-blue-100 text-blue-800 border-blue-200',
    'default': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  return colors[category] || colors.default;
};

// Get category icon
export const getCategoryIcon = (category) => {
  const icons = {
    'Scholarships': '🎓',
    'Hackathons': '💻',
    'Freelancing': '💼',
    'default': '📋'
  };
  
  return icons[category] || icons.default;
};

// Validate URL
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function (alternative to hook)
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format opportunity data
export const formatOpportunity = (opportunity) => {
  return {
    ...opportunity,
    id: opportunity.id || generateId(),
    title: opportunity.title || 'Untitled Opportunity',
    description: opportunity.description || 'No description available',
    deadline: formatDate(opportunity.deadline),
    source: opportunity.source || 'Unknown Source',
    link: opportunity.link || '#',
    type: opportunity.type || 'General',
    relevance_score: opportunity.relevance_score || 0
  };
};
