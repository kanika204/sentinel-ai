from flask import Blueprint, jsonify, send_file
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
import tempfile

from models.emergency import Emergency
from models.contact import Contact
from models.location_update import LocationUpdate

report_bp = Blueprint(
    "report",
    __name__
)


# ===========================================
# REPORT API (JSON)
# ===========================================

@report_bp.route(
    "/report/<int:emergency_id>",
    methods=["GET"]
)
def get_report(emergency_id):

    emergency = Emergency.query.get(emergency_id)

    if not emergency:

        return jsonify({

            "success": False,

            "message": "Emergency not found"

        }), 404

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

        "report": {

            "emergency_id": emergency.id,

            "status": emergency.status,

            "trigger_type": emergency.trigger_type,

            "risk_score": emergency.risk_score,

            "created_at": emergency.created_at.strftime(
                "%d %b %Y %I:%M %p"
            ),

            "latitude":

                latest_location.latitude

                if latest_location

                else emergency.latitude,

            "longitude":

                latest_location.longitude

                if latest_location

                else emergency.longitude,

            "ai_recommendation":

                emergency.ai_recommendation,

            "contacts": [

                {

                    "name": contact.name,

                    "phone": contact.phone,

                    "relationship": contact.relationship

                }

                for contact in contacts

            ]

        }

    })


# ===========================================
# DOWNLOAD PDF REPORT
# ===========================================

@report_bp.route(
    "/report/download/<int:emergency_id>",
    methods=["GET"]
)
def download_report(emergency_id):

    emergency = Emergency.query.get(emergency_id)

    if not emergency:

        return jsonify({

            "success": False,

            "message": "Emergency not found"

        }), 404

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

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    )

    doc = SimpleDocTemplate(temp_file.name)

    styles = getSampleStyleSheet()

    title_style = styles["Title"]

    title_style.alignment = TA_CENTER

    story = []

    # ===========================================
    # HEADER
    # ===========================================

    story.append(

        Paragraph(

            "SentinelAI Emergency Incident Report",

            title_style

        )

    )

    story.append(
        Spacer(1, 20)
    )

    # ===========================================
    # EMERGENCY DETAILS TABLE
    # ===========================================

    table_data = [

        ["Emergency ID", str(emergency.id)],

        ["Status", emergency.status],

        ["Trigger Type", emergency.trigger_type],

        ["Risk Score", str(emergency.risk_score)],

        [

            "Emergency Time",

            emergency.created_at.strftime(
                "%d %b %Y %I:%M %p"
            )

        ],

        [

            "Latitude",

            str(

                latest_location.latitude

                if latest_location

                else emergency.latitude

            )

        ],

        [

            "Longitude",

            str(

                latest_location.longitude

                if latest_location

                else emergency.longitude

            )

        ]

    ]

    table = Table(

        table_data,

        colWidths=[180, 300]

    )

    table.setStyle(

        TableStyle([

            ("BACKGROUND",

             (0, 0),

             (0, -1),

             colors.lightgrey),

            ("TEXTCOLOR",

             (0, 0),

             (-1, -1),

             colors.black),

            ("GRID",

             (0, 0),

             (-1, -1),

             1,

             colors.black),

            ("BOTTOMPADDING",

             (0, 0),

             (-1, -1),

             8),

            ("TOPPADDING",

             (0, 0),

             (-1, -1),

             8),

            ("FONTNAME",

             (0, 0),

             (0, -1),

             "Helvetica-Bold"),

            ("FONTNAME",

             (1, 0),

             (1, -1),

             "Helvetica"),

        ])

    )

    story.append(table)

    story.append(
        Spacer(1, 25)
    )

    # ===========================================
    # AI RECOMMENDATION
    # ===========================================

    story.append(

        Paragraph(

            "<b>AI Recommendation</b>",

            styles["Heading2"]

        )

    )

    story.append(

        Paragraph(

            emergency.ai_recommendation

            if emergency.ai_recommendation

            else "No recommendation available.",

            styles["BodyText"]

        )

    )

    story.append(
        Spacer(1, 20)
    )

    # ===========================================
    # TRUSTED CONTACTS
    # ===========================================

    story.append(

        Paragraph(

            "<b>Trusted Contacts</b>",

            styles["Heading2"]

        )

    )

    for contact in contacts:

        story.append(

            Paragraph(

                f"• {contact.name} "
                f"({contact.relationship}) "
                f"- {contact.phone}",

                styles["BodyText"]

            )

        )

    story.append(
        Spacer(1, 30)
    )

    # ===========================================
    # FOOTER
    # ===========================================

    story.append(

        Paragraph(

            "<b>Generated by SentinelAI Emergency Response Platform</b>",

            styles["Italic"]

        )

    )

    doc.build(story)

    return send_file(

        temp_file.name,

        as_attachment=True,

        download_name=f"SentinelAI_Report_{emergency.id}.pdf",

        mimetype="application/pdf"

    )