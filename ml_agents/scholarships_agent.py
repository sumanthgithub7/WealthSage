from .utils import search_tavily, format_opportunity, save_to_cache, load_from_cache
from typing import List, Dict

SCHOLARSHIP_QUERIES = [
    "latest student scholarships 2025 site:gov.in",
    "international scholarships for students 2025",
    "merit based scholarships for students",
    "need based financial aid for students",
    "scholarships for undergraduate students 2025",
    "scholarships for graduate students 2025",
    "STEM scholarships for students 2025",
    "scholarships for international students in USA 2025",
    "scholarships for women in technology 2025",
    "scholarships for minority students 2025"
]

def fetch_scholarships() -> List[Dict]:
    """
    Fetch scholarships from multiple sources using different search queries
    """
    # Try to load from cache first
    cached_results = load_from_cache('scholarships')
    if cached_results:
        return cached_results

    all_results = []
    for query in SCHOLARSHIP_QUERIES:
        results = search_tavily(query)
        for result in results:
            formatted_result = format_opportunity(result)
            formatted_result['type'] = 'Scholarship'
            all_results.append(formatted_result)

    # Remove duplicates based on title
    unique_results = {result['title']: result for result in all_results}.values()
    
    # Sort by relevance score
    sorted_results = sorted(unique_results, key=lambda x: x['relevance_score'], reverse=True)
    
    # Save to cache
    save_to_cache(list(sorted_results), 'scholarships')
    
    return list(sorted_results) 