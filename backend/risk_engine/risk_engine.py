from risk_engine.rules import calculate_risk


def evaluate_risk(trigger_type):

    risk_score = calculate_risk(trigger_type)

    if risk_score >= 80:
        risk_level = "HIGH"
    elif risk_score >= 50:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {
        "risk_score": risk_score,
        "risk_level": risk_level
    }