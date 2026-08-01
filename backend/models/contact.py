from database.database import db

class Contact(db.Model):

    __tablename__ = "contacts"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    phone = db.Column(db.String(20), nullable=False)

    relationship = db.Column(db.String(50))

    is_primary = db.Column(db.Boolean, default=False)