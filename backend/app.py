from flask import Flask
from flask_cors import CORS

from config import Config
from database.database import db
from routes.emergency_routes import emergency_bp
from routes.alert_routes import alert_bp
from routes.contact_routes import contact_bp
from routes.history_routes import history_bp
from routes.settings_routes import settings_bp
from routes.location_routes import location_bp
from models.emergency import Emergency
from routes.notification_routes import notification_bp
from routes.contact_dashboard_routes import contact_dashboard_bp
from routes.report_routes import report_bp
from models.notification import Notification
from routes.timeline_routes import timeline_bp
from routes.analytics_routes import analytics_bp
from routes.control_center_routes import control_center_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

db.init_app(app)

app.register_blueprint(alert_bp, url_prefix="/api")
app.register_blueprint(contact_bp, url_prefix="/api")
app.register_blueprint(history_bp, url_prefix="/api")
app.register_blueprint(settings_bp, url_prefix="/api")
app.register_blueprint(location_bp, url_prefix="/api")
app.register_blueprint(notification_bp, url_prefix="/api")
app.register_blueprint(emergency_bp, url_prefix="/api")
app.register_blueprint(
    contact_dashboard_bp,
    url_prefix="/api"
)
app.register_blueprint(
    report_bp,
    url_prefix="/api"
)
app.register_blueprint(timeline_bp, url_prefix="/api")
app.register_blueprint(analytics_bp, url_prefix="/api")
app.register_blueprint(control_center_bp, url_prefix="/api")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)