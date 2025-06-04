import React, { useCallback } from 'react';
import { ExternalLink, Bookmark, BookmarkCheck, Calendar, MapPin, Star, Clock, Award } from 'lucide-react';
import { truncateText, isValidUrl } from '../utils/helpers';

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

  // Get category-specific styling
  const getCategoryStyle = (category) => {
    const styles = {
      'Scholarships': {
        gradient: 'from-emerald-400/10 to-teal-500/10',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: <Award className="h-4 w-4" />
      },
      'Hackathons': {
        gradient: 'from-purple-400/10 to-pink-500/10',
        border: 'border-purple-200',
        badge: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: <Star className="h-4 w-4" />
      },
      'Freelancing': {
        gradient: 'from-blue-400/10 to-indigo-500/10',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <Clock className="h-4 w-4" />
      }
    };
    return styles[category] || styles['Scholarships'];
  };

  const categoryStyle = getCategoryStyle(type);

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
    <div className={`
      group relative bg-gradient-to-br ${categoryStyle.gradient}
      backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col
      border ${categoryStyle.border} hover:border-opacity-60
      shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out
      transform hover:-translate-y-1 animate-fade-in
    `}>
      {/* Floating Save Button */}
      <button
        onClick={handleSave}
        className={`
          absolute top-4 right-4 p-2.5 rounded-xl transition-all duration-300 z-10
          ${isSaved
            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200'
            : 'bg-white/80 text-gray-400 hover:text-pink-500 hover:bg-white shadow-md'
          }
          transform hover:scale-110 backdrop-blur-sm
        `}
        aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
      >
        {isSaved ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </button>

      {/* Header */}
      <div className="mb-4 pr-12">
        {/* Category Badge */}
        <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${categoryStyle.badge} mb-3`}>
          {categoryStyle.icon}
          <span>{type}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {title}
        </h3>
      </div>

      {/* Description */}
      <div className="flex-1 mb-6">
        <p className="text-gray-700 text-sm leading-relaxed">
          {truncateText(description, 120)}
        </p>
      </div>

      {/* Metadata */}
      <div className="space-y-3 mb-6">
        {/* Deadline */}
        {deadline && deadline !== 'No deadline' && (
          <div className="flex items-center text-sm">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <span className="text-gray-500 text-xs">Deadline</span>
              <p className="text-gray-900 font-medium">{deadline}</p>
            </div>
          </div>
        )}

        {/* Source */}
        <div className="flex items-center text-sm">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-gray-500 text-xs">Source</span>
            <p className="text-gray-900 font-medium truncate">{source}</p>
          </div>
        </div>

        {/* Relevance Score */}
        {relevance_score > 0 && (
          <div className="bg-white/60 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Match Score</span>
              <span className="text-xs font-bold text-gray-900">
                {Math.round(relevance_score * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(relevance_score * 100, 100)}%` }}
              />
            </div>
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
          className="group/btn inline-flex items-center justify-center w-full px-6 py-3
                     bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                     text-white text-sm font-semibold rounded-xl
                     transition-all duration-300 ease-in-out transform hover:scale-105
                     focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-offset-2
                     shadow-lg hover:shadow-xl"
        >
          <span>Explore Opportunity</span>
          <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </a>
      </div>
    </div>
  );
});

OpportunityCard.displayName = 'OpportunityCard';

export default OpportunityCard;
