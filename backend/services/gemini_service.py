import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_emergency_advice(risk_score, risk_level, trigger_type):

    prompt = f"""
You are an emergency safety assistant.

Emergency Details:
- Risk Score: {risk_score}
- Risk Level: {risk_level}
- Trigger Type: {trigger_type}

Provide:
1. A short assessment.
2. Three immediate safety recommendations.

Keep the response under 120 words.
"""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    return response.text