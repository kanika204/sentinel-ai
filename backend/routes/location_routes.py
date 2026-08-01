from models.emergency import Emergency
from flask import Blueprint, request, jsonify

from database.database import db
from models.location_update import LocationUpdate

location_bp = Blueprint("location", __name__)


@location_bp.route("/location/update", methods=["POST"])
def update_location():

    try:
        data = request.get_json()

        emergency_id = data.get("emergency_id")
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if emergency_id is None or latitude is None or longitude is None:
            return jsonify({
                "success": False,
                "message": "Missing required fields"
            }), 400

        location = LocationUpdate(
            emergency_id=emergency_id,
            latitude=latitude,
            longitude=longitude
        )

        db.session.add(location)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Location saved successfully"
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@location_bp.route("/location/<int:emergency_id>", methods=["GET"])
def get_location_history(emergency_id):

    emergency = Emergency.query.get(emergency_id)

    if not emergency:
        return jsonify({
            "success": False,
            "message": "Emergency not found"
        }), 404

    locations = (
        LocationUpdate.query
        .filter_by(emergency_id=emergency_id)
        .order_by(LocationUpdate.timestamp.asc())
        .all()
    )

    return jsonify({

        "success": True,

        "emergency": {
            "id": emergency.id,
            "status": emergency.status,
            "risk_score": emergency.risk_score,
            "trigger_type": emergency.trigger_type,
            "created_at": emergency.created_at.strftime("%d %b %Y %I:%M %p"),
            "ai_recommendation": emergency.ai_recommendation
        },

        "locations": [
            {
                "latitude": l.latitude,
                "longitude": l.longitude,
                "timestamp": l.timestamp.strftime("%I:%M:%S %p")
            }
            for l in locations
        ]

    })