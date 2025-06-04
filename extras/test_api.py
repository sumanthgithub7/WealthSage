import os
from dotenv import load_dotenv
from ml_agents.utils import search_tavily

def test_tavily_api():
    # Load environment variables
    load_dotenv()
    
    # Check if API key is set
    api_key = os.getenv('TAVILY_API_KEY')
    if not api_key:
        print("Error: TAVILY_API_KEY is not set in .env file")
        return
    
    print(f"API Key found: {api_key[:5]}...{api_key[-5:]}")
    
    # Test a simple search
    test_query = "latest student scholarships 2025"
    print(f"\nTesting search with query: {test_query}")
    
    results = search_tavily(test_query)
    
    if results:
        print(f"\nFound {len(results)} results:")
        for i, result in enumerate(results[:3], 1):
            print(f"\nResult {i}:")
            print(f"Title: {result['title']}")
            print(f"Description: {result['description'][:100]}...")
            print(f"Source: {result['source']}")
    else:
        print("No results found or error occurred")

if __name__ == "__main__":
    test_tavily_api() 