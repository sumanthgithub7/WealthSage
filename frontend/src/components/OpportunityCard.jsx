import React, { useCallback } from 'react';
import { ExternalLink, Bookmark, BookmarkCheck, Calendar, MapPin } from 'lucide-react';
import { truncateText, getCategoryColor, isValidUrl } from '../utils/helpers';

const OpportunityCard = React.memo(({ 
  opportunity, 
  onSave, 
  isSaved = false 
}) => {
  const {
    title,
    description,
    link,
    source,
    deadline,
    type,
    relevance_score
  } = opportunity;

  // Handle save/unsave
  const handleSave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSave(opportunity);
  }, [opportunity, onSave]);

  // Handle external link click
  const handleLinkClick = useCallback((e) => {
    if (!isValidUrl(link)) {
      e.preventDefault();
      console.warn('Invalid URL:', link);
    }
  }, [link]);

  return (
    <div className="card p-6 h-full flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          
          {/* Category Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(type)}`}>
            {type}
          </span>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`ml-3 p-2 rounded-full transition-colors duration-200 ${
            isSaved
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
          }`}
          aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
        >
          {isSaved ? (
            <BookmarkCheck className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Description */}
      <div className="flex-1 mb-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {truncateText(description, 120)}
        </p>
      </div>

      {/* Metadata */}
      <div className="space-y-2 mb-4">
        {/* Deadline */}
        {deadline && deadline !== 'No deadline' && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Deadline: {deadline}</span>
          </div>
        )}

        {/* Source */}
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="truncate">Source: {source}</span>
        </div>

        {/* Relevance Score */}
        {relevance_score > 0 && (
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(relevance_score * 100, 100)}%` }}
              />
            </div>
            <span className="ml-2 text-xs text-gray-500">
              {Math.round(relevance_score * 100)}% match
            </span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 
                     hover:bg-blue-700 text-white text-sm font-medium rounded-lg 
                     transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>Learn More</span>
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  );
});

OpportunityCard.displayName = 'OpportunityCard';

export default OpportunityCard;
