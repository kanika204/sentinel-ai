from services.twilio_service import send_sms

from models.notification import Notification
from database.database import db


def notify_contacts(emergency_id, contacts, latitude, longitude):

    print("===== Notification Service Called =====")

    message = f"""
🚨 SENTINEL AI EMERGENCY ALERT

A user has triggered an SOS.

Current Location:
https://maps.google.com/?q={latitude},{longitude}

Please contact them immediately.
"""

    successful = 0

    for contact in contacts:

        print(f"Processing {contact.name}")

        try:

            success = send_sms(contact.phone, message)

            print("SMS Result:", success)

        except Exception as e:

            print("Twilio Error:", e)

            success = False

        status = "DELIVERED" if success else "FAILED"

        notification = Notification(
            emergency_id=emergency_id,
            contact_name=contact.name,
            notification_type="SMS",
            status=status
        )

        db.session.add(notification)

        if success:
            successful += 1

    db.session.commit()

    print("Notifications Saved")

    return successful