import os
import requests
from typing import List, Dict
from datetime import datetime
import json
import logging
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

TAVILY_API_KEY = os.getenv('TAVILY_API_KEY')
if not TAVILY_API_KEY:
    logger.error("TAVILY_API_KEY is not set in environment variables")
else:
    logger.info("TAVILY_API_KEY loaded successfully")

def search_tavily(query: str, search_depth: str = "advanced") -> List[Dict]:
    """
    Enhanced Tavily search with better result processing
    """
    if not TAVILY_API_KEY:
        logger.error("TAVILY_API_KEY is not set in environment variables")
        return []

    url = "https://api.tavily.com/search"
    headers = {
        'Authorization': f'Bearer {TAVILY_API_KEY}',
        'Content-Type': 'application/json'
    }
    data = {
        'query': query,
        'search_depth': search_depth,
        'limit': 10,
        'include_answer': True,
        'include_raw_content': True
    }
    
    try:
        logger.info(f"Making Tavily API request for query: {query}")
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        results = response.json().get('results', [])
        
        # Process and clean the results
        processed_results = []
        for result in results:
            processed_result = {
                'title': result.get('title', ''),
                'description': result.get('description', ''),
                'link': result.get('url', ''),
                'source': result.get('source', ''),
                'published_date': result.get('published_date', ''),
                'relevance_score': result.get('relevance_score', 0)
            }
            processed_results.append(processed_result)
        
        logger.info(f"Found {len(processed_results)} results for query: {query}")
        return processed_results
    except requests.exceptions.RequestException as e:
        logger.error(f"Error in Tavily API request: {str(e)}")
        if hasattr(e.response, 'text'):
            logger.error(f"API Response: {e.response.text}")
        return []
    except Exception as e:
        logger.error(f"Unexpected error in Tavily search: {str(e)}")
        return []

def format_opportunity(opportunity: Dict) -> Dict:
    """
    Format opportunity data for consistent display
    """
    return {
        'title': opportunity.get('title', 'No Title'),
        'description': opportunity.get('description', 'No Description'),
        'link': opportunity.get('link', '#'),
        'source': opportunity.get('source', 'Unknown Source'),
        'deadline': opportunity.get('deadline', 'Not specified'),
        'type': opportunity.get('type', 'General'),
        'relevance_score': opportunity.get('relevance_score', 0)
    }

def save_to_cache(data: List[Dict], category: str):
    """
    Save search results to a cache file
    """
    try:
        cache_dir = "cache"
        if not os.path.exists(cache_dir):
            os.makedirs(cache_dir)
        
        cache_file = f"{cache_dir}/{category}_cache.json"
        with open(cache_file, 'w') as f:
            json.dump({
                'timestamp': datetime.now().isoformat(),
                'data': data
            }, f)
        logger.info(f"Saved {len(data)} results to cache for {category}")
    except Exception as e:
        logger.error(f"Error saving to cache: {str(e)}")

def load_from_cache(category: str) -> List[Dict]:
    """
    Load search results from cache if available and not expired
    """
    try:
        cache_file = f"cache/{category}_cache.json"
        if os.path.exists(cache_file):
            with open(cache_file, 'r') as f:
                cache_data = json.load(f)
                cache_time = datetime.fromisoformat(cache_data['timestamp'])
                if (datetime.now() - cache_time).total_seconds() < 3600:  # 1 hour cache
                    logger.info(f"Loaded {len(cache_data['data'])} results from cache for {category}")
                    return cache_data['data']
    except Exception as e:
        logger.error(f"Error loading from cache: {str(e)}")
    return [] 