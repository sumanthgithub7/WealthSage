from .utils import search_tavily, format_opportunity, save_to_cache, load_from_cache
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

FREELANCING_QUERIES = [
    "freelance programming jobs for students",
    "remote coding gigs for beginners",
    "student freelance opportunities",
    "part-time coding projects",
    "freelance web development jobs",
    "freelance data entry jobs",
    "freelance content writing jobs",
    "freelance graphic design jobs",
    "freelance social media jobs",
    "freelance virtual assistant jobs"
]

def is_freelancing_related(title: str, description: str) -> bool:
    """
    Check if the result is related to freelancing
    """
    freelancing_keywords = [
        'freelance', 'freelancer', 'gig', 'remote job', 'remote work',
        'work from home', 'part-time', 'contract', 'project-based',
        'independent contractor', 'self-employed'
    ]
    
    text = (title + ' ' + description).lower()
    return any(keyword in text for keyword in freelancing_keywords)

def fetch_freelancing_gigs() -> List[Dict]:
    """
    Fetch freelancing opportunities from multiple sources
    """
    # Try to load from cache first
    cached_results = load_from_cache('freelancing')
    if cached_results:
        return cached_results

    all_results = []
    for query in FREELANCING_QUERIES:
        results = search_tavily(query)
        for result in results:
            # Only include results that are actually about freelancing
            if is_freelancing_related(result.get('title', ''), result.get('description', '')):
                formatted_result = format_opportunity(result)
                formatted_result['type'] = 'Freelancing'
                all_results.append(formatted_result)

    # Remove duplicates based on title
    unique_results = {result['title']: result for result in all_results}.values()
    
    # Sort by relevance score
    sorted_results = sorted(unique_results, key=lambda x: x['relevance_score'], reverse=True)
    
    # Save to cache
    save_to_cache(list(sorted_results), 'freelancing')
    
    return list(sorted_results) 