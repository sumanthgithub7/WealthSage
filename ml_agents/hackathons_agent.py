from .utils import search_tavily, format_opportunity, save_to_cache, load_from_cache
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

HACKATHON_QUERIES = [
    "upcoming coding hackathons 2025",
    "tech competitions for students 2025",
    "coding competitions with prizes",
    "student hackathon events",
    "AI hackathon competitions",
    "blockchain hackathon 2025",
    "cybersecurity hackathon",
    "data science hackathon",
    "machine learning competition",
    "startup hackathon"
]

def is_hackathon_related(title: str, description: str) -> bool:
    """
    Check if the result is related to hackathons
    """
    hackathon_keywords = [
        'hackathon', 'hack', 'coding competition', 'tech competition',
        'coding challenge', 'programming contest', 'coding contest',
        'hackathon event', 'coding event', 'tech event'
    ]
    
    text = (title + ' ' + description).lower()
    return any(keyword in text for keyword in hackathon_keywords)

def fetch_hackathons() -> List[Dict]:
    """
    Fetch hackathons and tech competitions from multiple sources
    """
    # Try to load from cache first
    cached_results = load_from_cache('hackathons')
    if cached_results:
        return cached_results

    all_results = []
    for query in HACKATHON_QUERIES:
        results = search_tavily(query)
        for result in results:
            # Only include results that are actually about hackathons
            if is_hackathon_related(result.get('title', ''), result.get('description', '')):
                formatted_result = format_opportunity(result)
                formatted_result['type'] = 'Hackathon'
                all_results.append(formatted_result)

    # Remove duplicates based on title
    unique_results = {result['title']: result for result in all_results}.values()
    
    # Sort by relevance score
    sorted_results = sorted(unique_results, key=lambda x: x['relevance_score'], reverse=True)
    
    # Save to cache
    save_to_cache(list(sorted_results), 'hackathons')
    
    return list(sorted_results) 