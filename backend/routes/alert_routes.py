from flask import Blueprint, request, jsonify

from database.database import db
from models.emergency import Emergency
from models.contact import Contact

from services.notification_service import notify_contacts
from services.gemini_service import generate_emergency_advice

from risk_engine.risk_engine import evaluate_risk


alert_bp = Blueprint("alert", __name__)


@alert_bp.route("/sos", methods=["POST"])
def trigger_sos():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400

        if "latitude" not in data or "longitude" not in data:
            return jsonify({
                "success": False,
                "message": "Latitude and Longitude are required."
            }), 400

        trigger_type = data.get("trigger_type", "SOS_BUTTON")

        # -------------------------
        # Calculate Risk
        # -------------------------
        risk = evaluate_risk(trigger_type)

        # -------------------------
        # Generate AI Recommendation
        # -------------------------
        ai_recommendation = generate_emergency_advice(
            risk["risk_score"],
            risk["risk_level"],
            trigger_type
        )
        print("\n===== AI RECOMMENDATION =====")
        print(ai_recommendation)
        print("=============================\n")

        # -------------------------
        # Save Emergency
        # -------------------------
        emergency = Emergency(
            latitude=data["latitude"],
            longitude=data["longitude"],
            trigger_type=trigger_type,
            risk_score=risk["risk_score"],
            ai_recommendation=ai_recommendation,
            status="ACTIVE"
        )

        db.session.add(emergency)
        db.session.commit()

        # -------------------------
        # Fetch Trusted Contacts
        # -------------------------
        contacts = Contact.query.all()

        # -------------------------
        # Notify Contacts
        # -------------------------
        contacts_notified = notify_contacts(
            contacts,
            emergency.latitude,
            emergency.longitude
        )

        # -------------------------
        # API Response
        # -------------------------
        return jsonify({
            "success": True,
            "message": "Emergency Created Successfully",
            "emergency_id": emergency.id,
            "risk_score": risk["risk_score"],
            "risk_level": risk["risk_level"],
            "contacts_notified": contacts_notified,
            "ai_recommendation": emergency.ai_recommendation,
        }), 201

    except Exception as e:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@alert_bp.route("/emergency/<int:emergency_id>/end", methods=["PUT"])
def end_emergency(emergency_id):

    try:

        emergency = Emergency.query.get(emergency_id)

        if not emergency:
            return jsonify({
                "success": False,
                "message": "Emergency not found"
            }), 404

        emergency.status = "RESOLVED"

        db.session.commit()

        return jsonify({

            "success": True,
            "message": "Emergency ended successfully"

        })

    except Exception as e:

        db.session.rollback()

        return jsonify({

            "success": False,
            "message": str(e)

        }),500