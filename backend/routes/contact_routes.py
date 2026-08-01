from flask import Blueprint, request, jsonify

from database.database import db
from models.contact import Contact

contact_bp = Blueprint("contact", __name__)

@contact_bp.route("/contacts", methods=["POST"])
def add_contact():

    data = request.get_json()

    if not data.get("name") or not data.get("phone"):
        return jsonify({
        "success": False,
        "message": "Name and phone are required."
    }), 400

    contact = Contact(
        name=data["name"],
        phone=data["phone"],
        relationship=data.get("relationship", ""),
        is_primary=data.get("is_primary", False)
    )

    db.session.add(contact)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Contact Added Successfully"
    }), 201

@contact_bp.route("/contacts", methods=["GET"])
def get_contacts():

    contacts = Contact.query.all()

    result = []

    for contact in contacts:

        result.append({
            "id": contact.id,
            "name": contact.name,
            "phone": contact.phone,
            "relationship": contact.relationship,
            "is_primary": contact.is_primary
        })

    return jsonify(result)

@contact_bp.route("/contacts/<int:id>", methods=["DELETE"])
def delete_contact(id):

    contact = db.session.get(Contact, id)

    if not contact:
        return jsonify({"message": "Contact not found"}), 404

    db.session.delete(contact)
    db.session.commit()

    return jsonify({
        "success": True
    })

@contact_bp.route("/contacts/<int:id>", methods=["PUT"])
def update_contact(id):

    contact = db.session.get(Contact, id)

    if not contact:
        return jsonify({
            "success": False,
            "message": "Contact not found."
        }), 404

    data = request.get_json()

    contact.name = data.get("name", contact.name)
    contact.phone = data.get("phone", contact.phone)
    contact.relationship = data.get("relationship", contact.relationship)
    contact.is_primary = data.get("is_primary", contact.is_primary)

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Contact updated successfully."
    })