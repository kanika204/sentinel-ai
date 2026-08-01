from services.twilio_service import send_sms


def notify_contacts(contacts, latitude, longitude):

    message = f"""
🚨 SENTINEL AI EMERGENCY ALERT

A user has triggered an SOS.

Current Location:
https://maps.google.com/?q={latitude},{longitude}

Please contact them immediately.
"""

    successful = 0

    for contact in contacts:

        if send_sms(contact.phone, message):
            successful += 1

    return successful