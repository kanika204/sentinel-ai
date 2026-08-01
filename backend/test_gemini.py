from services.gemini_service import generate_emergency_advice

print(
    generate_emergency_advice(
        70,
        "MEDIUM",
        "SOS_BUTTON"
    )
)