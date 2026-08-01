from flask import Blueprint, jsonify

from models.emergency import Emergency

history_bp = Blueprint("history", __name__)


@history_bp.route("/history", methods=["GET"])
def get_history():

    emergencies = Emergency.query.order_by(
        Emergency.created_at.desc()
    ).all()

    history = []

    for emergency in emergencies:
        history.append({
    "id": emergency.id,
    "latitude": emergency.latitude,
    "longitude": emergency.longitude,
    "trigger_type": emergency.trigger_type,
    "risk_score": emergency.risk_score,
    "status": emergency.status,
    "created_at": emergency.created_at.strftime("%Y-%m-%d %H:%M:%S"),
    "maps_link": f"https://maps.google.com/?q={emergency.latitude},{emergency.longitude}",
    "ai_recommendation": emergency.ai_recommendation
})

    return jsonify({
        "success": True,
        "count": len(history),
        "history": history
    })