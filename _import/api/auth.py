#!/usr/bin/env python3
"""
Authentication API using Twilio for OTP verification
Based on Twilio blueprint integration
"""

import os
import secrets
import string
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client

app = Flask(__name__)
CORS(app)

# Twilio configuration from environment
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER")

# In-memory storage for demo (use Redis/DB in production)
otp_storage = {}
user_sessions = {}

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(secrets.choice(string.digits) for _ in range(6))

def send_twilio_message(to_phone_number: str, message: str) -> bool:
    """Send SMS using Twilio - based on blueprint"""
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        sms_message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone_number
        )
        
        print(f"Message sent with SID: {sms_message.sid}")
        return True
    except Exception as e:
        print(f"Error sending SMS: {e}")
        return False

@app.route('/api/auth/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to phone number"""
    data = request.get_json()
    phone = data.get('phone')
    name = data.get('name', 'User')
    
    if not phone:
        return jsonify({'error': 'Phone number required'}), 400
    
    # Generate and store OTP
    otp = generate_otp()
    otp_storage[phone] = {
        'otp': otp,
        'name': name,
        'timestamp': time.time(),
        'attempts': 0
    }
    
    # Send OTP via SMS
    message = f"Your LifeOS verification code is: {otp}"
    success = send_twilio_message(phone, message)
    
    if success:
        return jsonify({'success': True, 'message': 'OTP sent successfully'})
    else:
        return jsonify({'error': 'Failed to send OTP'}), 500

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP and create session"""
    data = request.get_json()
    phone = data.get('phone')
    otp = data.get('otp')
    
    if not phone or not otp:
        return jsonify({'error': 'Phone and OTP required'}), 400
    
    stored_data = otp_storage.get(phone)
    if not stored_data:
        return jsonify({'error': 'OTP not found or expired'}), 400
    
    # Check if OTP is expired (5 minutes)
    if time.time() - stored_data['timestamp'] > 300:
        del otp_storage[phone]
        return jsonify({'error': 'OTP expired'}), 400
    
    # Check attempts
    if stored_data['attempts'] >= 3:
        del otp_storage[phone]
        return jsonify({'error': 'Too many attempts'}), 400
    
    # Verify OTP
    if stored_data['otp'] == otp:
        # Create session token
        session_token = secrets.token_urlsafe(32)
        user_sessions[session_token] = {
            'phone': phone,
            'name': stored_data['name'],
            'login_time': time.time()
        }
        
        # Clean up OTP
        del otp_storage[phone]
        
        return jsonify({
            'success': True,
            'token': session_token,
            'user': {
                'phone': phone,
                'name': stored_data['name']
            }
        })
    else:
        stored_data['attempts'] += 1
        return jsonify({'error': 'Invalid OTP'}), 400

@app.route('/api/auth/verify-session', methods=['POST'])
def verify_session():
    """Verify session token"""
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Token required'}), 400
    
    session = user_sessions.get(token)
    if not session:
        return jsonify({'error': 'Invalid session'}), 401
    
    # Check if session is expired (24 hours)
    if time.time() - session['login_time'] > 86400:
        del user_sessions[token]
        return jsonify({'error': 'Session expired'}), 401
    
    return jsonify({
        'success': True,
        'user': {
            'phone': session['phone'],
            'name': session['name']
        }
    })

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout and invalidate session"""
    data = request.get_json()
    token = data.get('token')
    
    if token and token in user_sessions:
        del user_sessions[token]
    
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)