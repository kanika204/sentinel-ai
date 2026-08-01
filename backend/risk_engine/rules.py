from datetime import datetime


def calculate_risk(trigger_type):
    score = 20

    current_hour = datetime.now().hour

    # Night time
    if current_hour >= 21 or current_hour <= 5:
        score += 30

    # Trigger type
    if trigger_type == "VOICE":
        score += 30
    elif trigger_type == "SHAKE":
        score += 25
    elif trigger_type == "SOS_BUTTON":
        score += 20

    return min(score, 100)