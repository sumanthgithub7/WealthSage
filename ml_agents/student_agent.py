from typing import List, Dict
from .scholarships_agent import fetch_scholarships
from .hackathons_agent import fetch_hackathons
from .freelancing_agent import fetch_freelancing_gigs
import logging

logger = logging.getLogger(__name__)

# Cache for storing results
_opportunity_cache = {}

CATEGORY_FUNCTIONS = {
    'Scholarships': fetch_scholarships,
    'Hackathons': fetch_hackathons,
    'Freelancing': fetch_freelancing_gigs
}

def get_student_opportunities(category: str) -> List[Dict]:
    """
    Get opportunities for a specific category with caching
    """
    if category not in CATEGORY_FUNCTIONS:
        raise ValueError(f"Unknown category: {category}")

    # Check in-memory cache first
    if category in _opportunity_cache:
        logger.info(f"Returning cached results for {category}")
        return _opportunity_cache[category]

    # Fetch new results (this will check file cache internally)
    logger.info(f"Fetching new results for {category}")
    results = CATEGORY_FUNCTIONS[category]()

    # Update in-memory cache
    _opportunity_cache[category] = results

    return results