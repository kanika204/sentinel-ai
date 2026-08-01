from flask import Flask
from flask_cors import CORS

from config import Config
from database.database import db

from routes.alert_routes import alert_bp
from routes.contact_routes import contact_bp
from routes.history_routes import history_bp
from routes.settings_routes import settings_bp
from routes.location_routes import location_bp
from models.emergency import Emergency

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)

app.register_blueprint(alert_bp, url_prefix="/api")
app.register_blueprint(contact_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")
app.register_blueprint(settings_bp, url_prefix="/api")
app.register_blueprint(location_bp, url_prefix="/api")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)