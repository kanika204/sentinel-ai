from flask import Blueprint, jsonify

from models.emergency import Emergency
from models.notification import Notification

timeline_bp = Blueprint("timeline", __name__)


@timeline_bp.route("/timeline/<int:emergency_id>", methods=["GET"])
def emergency_timeline(emergency_id):

    try:

        emergency = Emergency.query.get(emergency_id)

        if not emergency:

            return jsonify({

                "success": False,
                "message": "Emergency not found"

            }),404

        timeline = []

        # ------------------------------------
        # Emergency Triggered
        # ------------------------------------

        timeline.append({

            "title": "Emergency Triggered",
            "description": f"{emergency.trigger_type} activated.",
            "time": emergency.created_at.strftime("%d %b %Y %I:%M %p"),
            "status": "completed"

        })

        # ------------------------------------
        # Risk Analysis
        # ------------------------------------

        timeline.append({

            "title": "Risk Analysis Completed",
            "description": f"Risk Score : {emergency.risk_score}",
            "time": emergency.created_at.strftime("%d %b %Y %I:%M %p"),
            "status": "completed"

        })

        # ------------------------------------
        # AI Recommendation
        # ------------------------------------

        timeline.append({

            "title": "AI Recommendation Generated",
            "description": "Gemini AI generated emergency guidance.",
            "time": emergency.created_at.strftime("%d %b %Y %I:%M %p"),
            "status": "completed"

        })

        # ------------------------------------
        # Notifications
        # ------------------------------------

        notifications = Notification.query.filter_by(

            emergency_id=emergency.id

        ).all()

        for notification in notifications:

            timeline.append({

                "title": "Trusted Contact Notified",

                "description":

                f"{notification.contact_name} ({notification.notification_type})",

                "time": notification.sent_at.strftime("%d %b %Y %I:%M %p"),

                "status": notification.status.lower()

            })

        # ------------------------------------
        # Live Tracking
        # ------------------------------------

        timeline.append({

            "title": "Live Tracking Started",

            "description":

            "GPS location monitoring enabled.",

            "time": emergency.created_at.strftime("%d %b %Y %I:%M %p"),

            "status": "completed"

        })

        # ------------------------------------
        # Report
        # ------------------------------------

        timeline.append({

            "title": "Emergency Report Generated",

            "description":

            "Emergency report is available for download.",

            "time": emergency.created_at.strftime("%d %b %Y %I:%M %p"),

            "status": "completed"

        })

        # ------------------------------------
        # Emergency Status
        # ------------------------------------

        if emergency.status == "ENDED":

            timeline.append({

                "title": "Emergency Resolved",

                "description":

                "Emergency ended successfully.",

                "time": emergency.created_at.strftime("%d %b %Y %I:%M %p"),

                "status": "completed"

            })

        return jsonify({

            "success": True,

            "timeline": timeline

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "message": str(e)

        }),500