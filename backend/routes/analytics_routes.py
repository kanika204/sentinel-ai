from flask import Blueprint, jsonify
from sqlalchemy import func

from models.emergency import Emergency
from models.notification import Notification

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/analytics", methods=["GET"])
def get_analytics():

    try:

        # ----------------------------------------
        # Emergency Statistics
        # ----------------------------------------

        total_emergencies = Emergency.query.count()

        active_emergencies = Emergency.query.filter_by(
            status="ACTIVE"
        ).count()

        resolved_emergencies = Emergency.query.filter_by(
            status="ENDED"
        ).count()

        avg_risk = db_avg = (
            Emergency.query.with_entities(
                func.avg(Emergency.risk_score)
            ).scalar()
        )

        average_risk_score = round(avg_risk, 2) if avg_risk else 0

        # ----------------------------------------
        # Notification Statistics
        # ----------------------------------------

        total_notifications = Notification.query.count()

        delivered_notifications = Notification.query.filter_by(
            status="DELIVERED"
        ).count()

        failed_notifications = Notification.query.filter_by(
            status="FAILED"
        ).count()

        success_rate = 0

        if total_notifications > 0:

            success_rate = round(
                (delivered_notifications / total_notifications) * 100,
                2
            )

        # ----------------------------------------
        # Recent Emergencies
        # ----------------------------------------

        recent = (

            Emergency.query

            .order_by(Emergency.created_at.desc())

            .limit(5)

            .all()

        )

        recent_emergencies = []

        for emergency in recent:

            recent_emergencies.append({

                "id": emergency.id,

                "trigger_type": emergency.trigger_type,

                "risk_score": emergency.risk_score,

                "status": emergency.status,

                "created_at":

                emergency.created_at.strftime(
                    "%d %b %Y %I:%M %p"
                )

            })

        # ----------------------------------------

        return jsonify({

            "success": True,

            "analytics": {

                "total_emergencies": total_emergencies,

                "active_emergencies": active_emergencies,

                "resolved_emergencies": resolved_emergencies,

                "average_risk_score": average_risk_score,

                "notifications_sent": total_notifications,

                "delivered_notifications": delivered_notifications,

                "failed_notifications": failed_notifications,

                "notification_success_rate": success_rate

            },

            "recent_emergencies": recent_emergencies

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500