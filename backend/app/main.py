from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from ml_agents.student_agent import get_student_opportunities
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create static directory if it doesn't exist
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
async def read_root():
    """Serve the main interface"""
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/api/opportunities/{category}")
async def read_opportunities(category: str):
    """API endpoint for fetching opportunities"""
    try:
        opportunities = get_student_opportunities(category)
        return {"category": category, "opportunities": opportunities}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) 