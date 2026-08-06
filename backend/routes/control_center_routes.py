from flask import Blueprint, jsonify

from models.emergency import Emergency
from models.notification import Notification

control_center_bp = Blueprint("control_center", __name__)


@control_center_bp.route("/control-center", methods=["GET"])
def get_control_center():

    try:

        # ----------------------------------------
        # Latest Active Emergency
        # ----------------------------------------

        active = (

            Emergency.query

            .filter_by(status="ACTIVE")

            .order_by(Emergency.created_at.desc())

            .first()

        )

        total_emergencies = Emergency.query.count()

        total_notifications = Notification.query.count()

        # ----------------------------------------
        # Recent Emergencies
        # ----------------------------------------

        recent = (

            Emergency.query

            .order_by(Emergency.created_at.desc())

            .limit(5)

            .all()

        )

        recent_list = []

        for emergency in recent:

            recent_list.append({

                "id": emergency.id,

                "trigger_type": emergency.trigger_type,

                "risk_score": emergency.risk_score,

                "status": emergency.status,

                "created_at": emergency.created_at.strftime(
                    "%d %b %Y %I:%M %p"
                )

            })

        if active:

            active_emergency = {

                "id": active.id,

                "trigger_type": active.trigger_type,

                "risk_score": active.risk_score,

                "status": active.status,

                "latitude": active.latitude,

                "longitude": active.longitude,

                "created_at": active.created_at.strftime(
                    "%d %b %Y %I:%M %p"
                )

            }

        else:

            active_emergency = None

        return jsonify({

            "success": True,

            "active_emergency": active_emergency,

            "summary": {

                "total_emergencies": total_emergencies,

                "notifications_sent": total_notifications

            },

            "recent_emergencies": recent_list

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500