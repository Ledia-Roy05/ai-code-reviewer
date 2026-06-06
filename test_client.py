import requests
import json

# The URL where your FastAPI local engine is running right now
URL = "http://127.0.0.1:8000/api/v1/review"

# An intentionally buggy Python script for the AI to review
# Issue: Modifying a list while looping over it (causes item-skipping bugs!)
buggy_code = """
def remove_even_numbers(numbers):
    for num in numbers:
        if num % 2 == 0:
            numbers.remove(num)
    return numbers
"""

# Package up the request parameters
params = {
    "file_name": "utils.py",
    "code_content": buggy_code,
    "language": "python"
}

print("🚀 Sending buggy code to your AI Engine... Please wait a moment.")

try:
    # Send a POST request to our running FastAPI server
    response = requests.post(URL, params=params)
    
    if response.status_code == 200:
        print("\n🎉 Success! Here is the senior developer structured review report:\n")
        # Pretty print the structured JSON response
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"❌ Oops, the server returned an error code: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"❌ Could not connect to the server. Is your uvicorn engine running?")
    print(f"Error details: {e}")