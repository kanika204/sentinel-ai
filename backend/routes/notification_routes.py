from flask import Blueprint, jsonify

from models.notification import Notification

notification_bp = Blueprint(
    "notification",
    __name__
)


@notification_bp.route(
    "/notifications/<int:emergency_id>",
    methods=["GET"]
)
def get_notifications(emergency_id):

    notifications = (

        Notification.query

        .filter_by(
            emergency_id=emergency_id
        )

        .order_by(
            Notification.sent_at.desc()
        )

        .all()

    )

    return jsonify({

        "success": True,

        "notifications": [

            {

                "id": notification.id,

                "contact_name": notification.contact_name,

                "notification_type": notification.notification_type,

                "status": notification.status,

                "sent_at": notification.sent_at.strftime(
                    "%d %b %Y %I:%M %p"
                )

            }

            for notification in notifications

        ]

    })