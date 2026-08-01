from datetime import datetime
from database.database import db


class Emergency(db.Model):

    __tablename__ = "emergencies"

    id = db.Column(db.Integer, primary_key=True)

    latitude = db.Column(db.Float, nullable=False)

    longitude = db.Column(db.Float, nullable=False)

    trigger_type = db.Column(db.String(30), default="SOS_BUTTON")

    risk_score = db.Column(db.Integer, default=0)

    status = db.Column(db.String(20), default="ACTIVE")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    ai_recommendation = db.Column(db.Text, nullable=True)