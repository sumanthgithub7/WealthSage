import React, { useCallback } from 'react';
import { getCategoryIcon } from '../utils/helpers';

const CategoryTabs = React.memo(({ categories, activeCategory, onCategoryChange }) => {
  // Handle tab click
  const handleTabClick = useCallback((category) => {
    onCategoryChange(category);
  }, [onCategoryChange]);

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
        <nav className="flex space-x-1" aria-label="Category tabs">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            const icon = getCategoryIcon(category);
            
            return (
              <button
                key={category}
                onClick={() => handleTabClick(category)}
                className={`
                  flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="mr-2 text-base">{icon}</span>
                <span className="hidden sm:inline">{category}</span>
                <span className="sm:hidden">
                  {category === 'Scholarships' ? 'Scholar' : 
                   category === 'Hackathons' ? 'Hack' : 
                   'Freelance'}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
});

CategoryTabs.displayName = 'CategoryTabs';

export default CategoryTabs;
