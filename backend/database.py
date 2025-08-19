import sqlite3
import os
from datetime import datetime
import hashlib
import secrets
from typing import Optional, Dict, Any
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, db_path: str = "wealthsage.db"):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        """Get database connection with proper error handling"""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row  # Enable dict-like access
            return conn
        except sqlite3.Error as e:
            logger.error(f"Database connection error: {e}")
            raise Exception(f"Unable to connect to database: {e}")
    
    def init_database(self):
        """Initialize database with all required tables"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # Users table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        uid TEXT UNIQUE NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password_hash TEXT,
                        first_name TEXT NOT NULL,
                        last_name TEXT NOT NULL,
                        display_name TEXT,
                        role TEXT NOT NULL DEFAULT 'Student',
                        phone TEXT,
                        avatar_url TEXT,
                        is_active BOOLEAN DEFAULT 1,
                        is_verified BOOLEAN DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        last_login TIMESTAMP,
                        firebase_uid TEXT,
                        provider TEXT DEFAULT 'email'
                    )
                ''')
                
                # User profiles table for additional data
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS user_profiles (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        university TEXT,
                        major TEXT,
                        graduation_year INTEGER,
                        monthly_income DECIMAL(10,2) DEFAULT 0,
                        savings_goal DECIMAL(10,2) DEFAULT 0,
                        current_savings DECIMAL(10,2) DEFAULT 0,
                        budget_limit DECIMAL(10,2) DEFAULT 0,
                        preferences TEXT, -- JSON string
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                    )
                ''')
                
                # Sessions table for authentication
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS user_sessions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        session_token TEXT UNIQUE NOT NULL,
                        firebase_token TEXT,
                        expires_at TIMESTAMP NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        is_active BOOLEAN DEFAULT 1,
                        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                    )
                ''')
                
                # Income sources table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS income_sources (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        source_name TEXT NOT NULL,
                        source_type TEXT NOT NULL, -- scholarship, freelance, job, etc.
                        amount DECIMAL(10,2) NOT NULL,
                        frequency TEXT DEFAULT 'monthly', -- monthly, yearly, one-time
                        description TEXT,
                        url TEXT,
                        deadline DATE,
                        status TEXT DEFAULT 'active', -- active, applied, completed
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                    )
                ''')
                
                # Financial goals table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS financial_goals (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        goal_name TEXT NOT NULL,
                        target_amount DECIMAL(10,2) NOT NULL,
                        current_amount DECIMAL(10,2) DEFAULT 0,
                        target_date DATE,
                        category TEXT, -- emergency, education, travel, etc.
                        description TEXT,
                        is_completed BOOLEAN DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                    )
                ''')
                
                conn.commit()
                logger.info("Database initialized successfully")
                
        except sqlite3.Error as e:
            logger.error(f"Database initialization error: {e}")
            raise Exception(f"Failed to initialize database: {e}")
    
    def hash_password(self, password: str) -> str:
        """Hash password with salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return f"{salt}:{password_hash.hex()}"
    
    def verify_password(self, password: str, password_hash: str) -> bool:
        """Verify password against hash"""
        try:
            salt, hash_hex = password_hash.split(':')
            password_check = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
            return password_check.hex() == hash_hex
        except:
            return False
    
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                # Check if user already exists
                cursor.execute("SELECT id FROM users WHERE email = ?", (user_data['email'],))
                if cursor.fetchone():
                    raise Exception("User with this email already exists")
                
                # Hash password if provided
                password_hash = None
                if user_data.get('password'):
                    password_hash = self.hash_password(user_data['password'])
                
                # Insert user
                cursor.execute('''
                    INSERT INTO users (
                        uid, email, password_hash, first_name, last_name, 
                        display_name, role, firebase_uid, provider
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    user_data.get('uid', secrets.token_urlsafe(16)),
                    user_data['email'],
                    password_hash,
                    user_data['first_name'],
                    user_data['last_name'],
                    user_data.get('display_name', f"{user_data['first_name']} {user_data['last_name']}"),
                    user_data.get('role', 'Student'),
                    user_data.get('firebase_uid'),
                    user_data.get('provider', 'email')
                ))
                
                user_id = cursor.lastrowid
                
                # Create user profile
                cursor.execute('''
                    INSERT INTO user_profiles (user_id, university, preferences)
                    VALUES (?, ?, ?)
                ''', (
                    user_id,
                    user_data.get('university', ''),
                    '{}' # Empty JSON preferences
                ))
                
                conn.commit()
                
                # Return user data
                return self.get_user_by_id(user_id)
                
        except sqlite3.Error as e:
            logger.error(f"Error creating user: {e}")
            raise Exception(f"Failed to create user: {e}")
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT u.*, p.university, p.monthly_income, p.savings_goal, 
                           p.current_savings, p.budget_limit
                    FROM users u
                    LEFT JOIN user_profiles p ON u.id = p.user_id
                    WHERE u.email = ? AND u.is_active = 1
                ''', (email,))
                
                row = cursor.fetchone()
                if row:
                    return dict(row)
                return None
                
        except sqlite3.Error as e:
            logger.error(f"Error getting user by email: {e}")
            return None
    
    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT u.*, p.university, p.monthly_income, p.savings_goal, 
                           p.current_savings, p.budget_limit
                    FROM users u
                    LEFT JOIN user_profiles p ON u.id = p.user_id
                    WHERE u.id = ? AND u.is_active = 1
                ''', (user_id,))
                
                row = cursor.fetchone()
                if row:
                    return dict(row)
                return None
                
        except sqlite3.Error as e:
            logger.error(f"Error getting user by ID: {e}")
            return None
    
    def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with email and password"""
        try:
            user = self.get_user_by_email(email)
            if not user or not user.get('password_hash'):
                return None
            
            if self.verify_password(password, user['password_hash']):
                # Update last login
                with self.get_connection() as conn:
                    cursor = conn.cursor()
                    cursor.execute('''
                        UPDATE users SET last_login = CURRENT_TIMESTAMP 
                        WHERE id = ?
                    ''', (user['id'],))
                    conn.commit()
                
                return user
            return None
            
        except sqlite3.Error as e:
            logger.error(f"Error authenticating user: {e}")
            return None
    
    def create_session(self, user_id: int, firebase_token: str = None) -> str:
        """Create a new session for user"""
        try:
            session_token = secrets.token_urlsafe(32)
            expires_at = datetime.now().timestamp() + (24 * 60 * 60)  # 24 hours
            
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO user_sessions (user_id, session_token, firebase_token, expires_at)
                    VALUES (?, ?, ?, ?)
                ''', (user_id, session_token, firebase_token, expires_at))
                conn.commit()
            
            return session_token
            
        except sqlite3.Error as e:
            logger.error(f"Error creating session: {e}")
            raise Exception(f"Failed to create session: {e}")
    
    def get_user_income_sources(self, user_id: int) -> list:
        """Get user's income sources"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    SELECT * FROM income_sources 
                    WHERE user_id = ? AND status = 'active'
                    ORDER BY created_at DESC
                ''', (user_id,))
                
                return [dict(row) for row in cursor.fetchall()]
                
        except sqlite3.Error as e:
            logger.error(f"Error getting income sources: {e}")
            return []

# Global database instance
db = DatabaseManager()
