import os
import json
from fastapi import FastAPI, HTTPException
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv

# Load secret keys from our .env file
load_dotenv()

app = FastAPI(title="AI Code Reviewer Engine (Gemini)")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your frontend to connect without getting blocked
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Free Gemini Client
# It automatically reads GEMINI_API_KEY from your .env file
client = genai.Client()

# --- 1. Defining what our Structured Review Report looks like ---
class CodeIssue(BaseModel):
    file_path: str = Field(description="Path of the file being reviewed")
    line_number: int = Field(description="The specific line number where the issue exists (1-indexed)")
    severity: str = Field(description="Critical, Warning, or Optimization")
    category: str = Field(description="Security, Performance, Bug, or Style")
    issue_description: str = Field(description="Clear explanation of what is wrong with the code")
    suggested_fix: str = Field(description="The exact corrected code snippet or fix")

class CodeReviewReport(BaseModel):
    summary: str = Field(description="High-level overview of the code quality and structural feedback")
    score: int = Field(description="Overall code quality score from 1 to 100")
    issues: List[CodeIssue]

# --- 2. The API endpoint that accepts code submissions ---
@app.post("/api/v1/review", response_model=CodeReviewReport)
async def review_code(file_name: str, code_content: str, language: str):
    if not code_content.strip():
        raise HTTPException(status_code=400, detail="Code content cannot be empty.")

    system_prompt = (
        "You are an expert Senior Software Engineer and Static Analysis Tool. "
        "Your task is to review the provided code for bugs, security vulnerabilities, "
        "performance bottlenecks, and adherence to clean code principles. "
        "You must strictly output structured data matching the provided JSON schema. "
        "Be completely precise with your line numbers."
    )

    user_content = f"Language: {language}\nFile Name: {file_name}\n\nCode to review:\n```\n{code_content}\n```"

    try:
        # Call the Gemini API using the official google-genai syntax
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.1,  # Low temperature keeps the review analytical and logical
                response_mime_type="application/json",
                response_schema=CodeReviewReport,  # Tells Gemini exactly how to structure the JSON
            ),
        )

        # Parse Gemini's text response back into a python dictionary matching our model
        structured_data = json.loads(response.text)
        return structured_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini Processing Error: {str(e)}")