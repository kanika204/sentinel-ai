from datetime import datetime
from database.database import db


class LocationUpdate(db.Model):

    __tablename__ = "location_updates"

    id = db.Column(db.Integer, primary_key=True)

    emergency_id = db.Column(
        db.Integer,
        db.ForeignKey("emergencies.id"),
        nullable=False
    )

    latitude = db.Column(db.Float, nullable=False)

    longitude = db.Column(db.Float, nullable=False)

    timestamp = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )