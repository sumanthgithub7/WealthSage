from flask import current_app
from flask_mail import Message
from threading import Thread
import random
import string

def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_email(subject, recipients, text_body, html_body=None):
    msg = Message(subject, recipients=recipients)
    msg.body = text_body
    if html_body:
        msg.html = html_body
    
    # Send email asynchronously
    Thread(target=send_async_email,
           args=(current_app._get_current_object(), msg)).start()

def send_password_reset_email(user):
    token = user.get_reset_token()
    send_email(
        'Reset Your Password',
        [user.email],
        f'''To reset your password, visit the following link:
{url_for('auth.reset_password', token=token, _external=True)}

If you did not make this request then simply ignore this email.
''',
        f'''
<p>To reset your password, visit the following link:</p>
<p><a href="{url_for('auth.reset_password', token=token, _external=True)}">Click here to reset your password</a></p>
<p>If you did not make this request then simply ignore this email.</p>
'''
    )

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def send_otp_sms(phone_number, otp):
    """Mock function to send OTP via SMS"""
    # In production, you would integrate with Twilio or another SMS service
    print(f"Sending OTP {otp} to {phone_number}")
    # Return True to simulate successful sending
    return True
