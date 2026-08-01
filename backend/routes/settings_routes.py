from flask import Blueprint

settings_bp = Blueprint("settings", __name__)

@settings_bp.route("/settings", methods=["GET"])
def get_settings():
    return {
        "success": True
    }