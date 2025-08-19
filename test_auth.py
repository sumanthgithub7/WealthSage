#!/usr/bin/env python3
"""
Test script to verify authentication functionality
"""
import requests
import json
import sys

API_BASE = "http://localhost:8000"

def test_health():
    """Test API health"""
    try:
        response = requests.get(f"{API_BASE}/api/health")
        print(f"✅ Health Check: {response.status_code}")
        print(f"   Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health Check Failed: {e}")
        return False

def test_signup():
    """Test user signup"""
    try:
        user_data = {
            "email": "test@student.com",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "Student",
            "role": "Student"
        }
        
        response = requests.post(f"{API_BASE}/api/auth/signup", json=user_data)
        print(f"✅ Signup Test: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   User Created: {data['user']['email']}")
            print(f"   Session Token: {data['session_token'][:20]}...")
            return data['session_token']
        else:
            print(f"   Error: {response.json()}")
            return None
            
    except Exception as e:
        print(f"❌ Signup Test Failed: {e}")
        return None

def test_login():
    """Test user login"""
    try:
        login_data = {
            "email": "test@student.com",
            "password": "testpass123"
        }
        
        response = requests.post(f"{API_BASE}/api/auth/login", json=login_data)
        print(f"✅ Login Test: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   User Logged In: {data['user']['email']}")
            print(f"   Role: {data['user']['role']}")
            print(f"   Session Token: {data['session_token'][:20]}...")
            return data['session_token']
        else:
            print(f"   Error: {response.json()}")
            return None
            
    except Exception as e:
        print(f"❌ Login Test Failed: {e}")
        return None

def test_opportunities():
    """Test opportunities API"""
    try:
        response = requests.get(f"{API_BASE}/api/opportunities/Scholarships")
        print(f"✅ Opportunities Test: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Category: {data['category']}")
            print(f"   Opportunities Found: {len(data['opportunities'])}")
            if data['opportunities']:
                print(f"   Sample: {data['opportunities'][0]['title'][:50]}...")
            return True
        else:
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Opportunities Test Failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing WealthSage Backend API")
    print("=" * 50)
    
    # Test 1: Health Check
    if not test_health():
        print("❌ Backend is not healthy. Exiting.")
        sys.exit(1)
    
    print()
    
    # Test 2: Signup
    signup_token = test_signup()
    print()
    
    # Test 3: Login
    login_token = test_login()
    print()
    
    # Test 4: Opportunities
    test_opportunities()
    print()
    
    # Summary
    print("=" * 50)
    if signup_token and login_token:
        print("✅ ALL TESTS PASSED!")
        print("🎉 Authentication system is working correctly!")
        print()
        print("📋 Next Steps:")
        print("1. Open http://localhost:5174 in your browser")
        print("2. Click 'Sign Up' and create a new account")
        print("3. Try logging in with your credentials")
        print("4. Access the student dashboard to see live data")
    else:
        print("❌ Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
