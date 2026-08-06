from flask import Blueprint, jsonify

from models.emergency import Emergency
from models.contact import Contact
from models.location_update import LocationUpdate

contact_dashboard_bp = Blueprint(
    "contact_dashboard",
    __name__
)


@contact_dashboard_bp.route(
    "/contact-dashboard/<int:emergency_id>",
    methods=["GET"]
)
def contact_dashboard(emergency_id):

    emergency = Emergency.query.get(emergency_id)

    if not emergency:

        return jsonify({
            "success": False,
            "message": "Emergency not found"
        }),404

    contacts = Contact.query.all()

    latest_location = (

        LocationUpdate.query

        .filter_by(
            emergency_id=emergency_id
        )

        .order_by(
            LocationUpdate.timestamp.desc()
        )

        .first()

    )

    return jsonify({

        "success": True,

        "emergency":{

            "id": emergency.id,

            "status": emergency.status,

            "trigger_type": emergency.trigger_type,

            "risk_score": emergency.risk_score,

            "latitude": emergency.latitude,

            "longitude": emergency.longitude,

            "created_at": emergency.created_at.strftime("%d %b %Y %I:%M %p"),

            "ai_recommendation": emergency.ai_recommendation

        },

        "latest_location":{

            "latitude":

            latest_location.latitude

            if latest_location

            else emergency.latitude,

            "longitude":

            latest_location.longitude

            if latest_location

            else emergency.longitude

        },

        "contacts":[

            {

                "id": contact.id,

                "name": contact.name,

                "phone": contact.phone,

                "relationship": contact.relationship

            }

            for contact in contacts

        ]

    })