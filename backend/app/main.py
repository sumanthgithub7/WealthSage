from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import os
import logging
from dotenv import load_dotenv
from ml_agents.student_agent import get_student_opportunities
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import db
from excel_service import excel_service

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="WealthSage API", version="1.0.0")

# Security
security = HTTPBearer()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: str = "Student"
    university: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    display_name: str
    role: str
    is_verified: bool
    created_at: str

# Create static directory if it doesn't exist
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        db.init_database()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

@app.get("/")
async def read_root():
    """Health check endpoint"""
    return {"message": "WealthSage API is running", "status": "healthy"}

@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    try:
        # Test database connection
        with db.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return {
            "status": "healthy",
            "database": "connected",
            "api": "running"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=f"Service unhealthy: {e}")

@app.post("/api/auth/signup")
async def signup(user_data: UserSignup):
    """User registration endpoint with Excel export"""
    try:
        # Create user in database
        user = db.create_user({
            'email': user_data.email,
            'password': user_data.password,
            'first_name': user_data.first_name,
            'last_name': user_data.last_name,
            'role': user_data.role,
            'university': user_data.university
        })

        # Export user to Excel
        try:
            excel_file = excel_service.export_user_on_signup(user)
            if excel_file:
                logger.info(f"User {user['email']} exported to Excel: {excel_file}")
        except Exception as excel_error:
            logger.error(f"Excel export failed: {excel_error}")
            # Don't fail signup if Excel export fails

        # Create session
        session_token = db.create_session(user['id'])

        return {
            "message": "User created successfully",
            "user": {
                "id": user['id'],
                "email": user['email'],
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "role": user['role'],
                "display_name": user.get('display_name', f"{user['first_name']} {user['last_name']}")
            },
            "session_token": session_token
        }

    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    """User login endpoint"""
    try:
        # Authenticate user
        user = db.authenticate_user(credentials.email, credentials.password)

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        # Create session
        session_token = db.create_session(user['id'])

        return {
            "message": "Login successful",
            "user": {
                "id": user['id'],
                "email": user['email'],
                "first_name": user['first_name'],
                "last_name": user['last_name'],
                "role": user['role'],
                "display_name": user['display_name']
            },
            "session_token": session_token
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@app.get("/api/opportunities/{category}")
async def read_opportunities(category: str):
    """API endpoint for fetching opportunities"""
    try:
        opportunities = get_student_opportunities(category)
        return {"category": category, "opportunities": opportunities}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error fetching opportunities: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch opportunities")

@app.get("/api/admin/export-users")
async def export_users():
    """Export all users to Excel file"""
    try:
        excel_file = excel_service.export_users_to_excel()
        if excel_file:
            return {
                "message": "Users exported successfully",
                "file_path": excel_file,
                "download_url": f"/api/admin/download/{os.path.basename(excel_file)}"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to export users")
    except Exception as e:
        logger.error(f"Error exporting users: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/download/{filename}")
async def download_file(filename: str):
    """Download exported Excel file"""
    try:
        file_path = os.path.join("user_exports", filename)
        if os.path.exists(file_path):
            return FileResponse(
                path=file_path,
                filename=filename,
                media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        else:
            raise HTTPException(status_code=404, detail="File not found")
    except Exception as e:
        logger.error(f"Error downloading file: {e}")
        raise HTTPException(status_code=500, detail=str(e))