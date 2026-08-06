from flask import Blueprint, jsonify

from models.emergency import Emergency

emergency_bp = Blueprint("emergency", __name__)


# ==========================================
# GET SINGLE EMERGENCY DETAILS
# ==========================================

@emergency_bp.route("/emergency/<int:id>", methods=["GET"])
def get_emergency(id):

    try:

        emergency = Emergency.query.get(id)

        if not emergency:

            return jsonify({

                "success": False,
                "message": "Emergency not found"

            }), 404

        return jsonify({

            "success": True,

            "emergency": {

                "id": emergency.id,

                "status": emergency.status,

                "trigger_type": emergency.trigger_type,

                "risk_score": emergency.risk_score,

                "latitude": emergency.latitude,

                "longitude": emergency.longitude,

                "created_at": emergency.created_at.strftime("%d %b %Y %I:%M %p"),

                "ai_recommendation": emergency.ai_recommendation

            }

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "message": str(e)

        }), 500


# ==========================================
# GET ACTIVE EMERGENCY
# ==========================================

@emergency_bp.route("/active-emergency", methods=["GET"])
def get_active_emergency():

    try:

        emergency = (

            Emergency.query

            .filter_by(status="ACTIVE")

            .order_by(Emergency.created_at.desc())

            .first()

        )

        if not emergency:

            return jsonify({

                "success": False

            })

        return jsonify({

            "success": True,

            "emergency": {

                "id": emergency.id,

                "status": emergency.status,

                "risk_score": emergency.risk_score,

                "trigger_type": emergency.trigger_type,

                "latitude": emergency.latitude,

                "longitude": emergency.longitude,

                "created_at": emergency.created_at.strftime("%d %b %Y %I:%M %p"),

                "ai_recommendation": emergency.ai_recommendation

            }

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }),500