from datetime import datetime
from database.database import db


class Notification(db.Model):

    __tablename__ = "notifications"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    emergency_id = db.Column(
        db.Integer,
        db.ForeignKey("emergencies.id"),
        nullable=False
    )

    contact_name = db.Column(
        db.String(100),
        nullable=False
    )

    notification_type = db.Column(
        db.String(30),
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="DELIVERED"
    )

    sent_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )