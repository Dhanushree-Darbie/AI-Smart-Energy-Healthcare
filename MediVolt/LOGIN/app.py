from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_cors import CORS
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import time

app = Flask(__name__, 
            template_folder='.',
            static_folder='.',
            static_url_path='')

# Enable CORS for all routes
CORS(app)

# Store OTPs temporarily (in production, use Redis or database)
otp_store = {}

# OTP validity duration in seconds (10 minutes)
OTP_VALIDITY_DURATION = 600

# Email configuration (update with your email settings)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "your_email@gmail.com"
SENDER_PASSWORD = "your_app_password"

def send_email(recipient_email, otp):
    """Send OTP via email"""
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = recipient_email
        msg['Subject'] = "MediVolt Password Reset OTP"
        
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px;">
                <h2 style="color: #0F766E;">MediVolt Password Reset</h2>
                <p>You requested to reset your password. Your OTP is:</p>
                <div style="background-color: #0F766E; color: white; padding: 15px; 
                            font-size: 24px; font-weight: bold; text-align: center; 
                            border-radius: 5px; letter-spacing: 5px;">
                    {otp}
                </div>
                <p style="color: #666;">This OTP is valid for 10 minutes.</p>
                <p style="color: #999; font-size: 12px;">
                    If you didn't request this, please ignore this email.
                </p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, recipient_email, msg.as_string())
        server.quit()
        
        return True, "Email sent successfully"
    except Exception as e:
        return False, str(e)

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to user's email"""
    data = request.get_json()
    
    email = data.get('email')
    phone = data.get('phone')
    
    if not email or not phone:
        return jsonify({"success": False, "message": "Email and phone are required"}), 400
    
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    
    # Store OTP with timestamp
    otp_store[email] = {
        'otp': otp,
        'phone': phone,
        'timestamp': __import__('time').time()
    }
    
    # Try to send email
    success, message = send_email(email, otp)
    
    if success:
        return jsonify({
            "success": True, 
            "message": "OTP sent to your email",
            "demo_otp": otp  # Remove this in production
        })
    else:
        # For demo purposes, still return success with demo OTP
        return jsonify({
            "success": True, 
            "message": "OTP generated (email failed)",
            "demo_otp": otp,
            "note": "Configure email settings to send real emails"
        })

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP entered by user"""
    data = request.get_json()
    
    email = data.get('email')
    entered_otp = data.get('otp')
    
    if not email or not entered_otp:
        return jsonify({"success": False, "message": "Email and OTP are required"}), 400
    
    stored_data = otp_store.get(email)
    
    if not stored_data:
        return jsonify({"success": False, "message": "No OTP found for this email"}), 404
    
    # Check if OTP has expired
    current_time = time.time()
    otp_time = stored_data.get('timestamp', 0)
    if current_time - otp_time > OTP_VALIDITY_DURATION:
        # OTP expired, remove it
        del otp_store[email]
        return jsonify({"success": False, "message": "OTP has expired. Please request a new one."}), 400
    
    # Check if OTP matches
    if stored_data['otp'] == entered_otp:
        # Clear OTP after successful verification
        del otp_store[email]
        return jsonify({"success": True, "message": "OTP verified successfully"})
    
    return jsonify({"success": False, "message": "Invalid OTP"}), 400

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    """Reset password after OTP verification"""
    data = request.get_json()
    
    email = data.get('email')
    new_password = data.get('newPassword')
    
    if not email or not new_password:
        return jsonify({"success": False, "message": "Email and new password are required"}), 400
    
    # In production, update password in database
    # For demo, just return success
    return jsonify({
        "success": True, 
        "message": "Password reset successfully"
    })

@app.route('/')
def index():
    return jsonify({
        "message": "MediVolt API is running",
        "endpoints": {
            "POST /api/send-otp": "Send OTP to email",
            "POST /api/verify-otp": "Verify OTP",
            "POST /api/reset-password": "Reset password"
        }
    })

# HTML Page Routes
@app.route('/login')
def login():
    return render_template('LOGIN/login.html')

@app.route('/forgot-password')
def forgot_password():
    return render_template('LOGIN/forgot-password.html')

@app.route('/dashboard')
def dashboard():
    return render_template('LOGIN/dashboard.html')

@app.route('/style.css')
def style():
    return app.send_static_file('LOGIN/style.css')

@app.route('/script.js')
def script():
    return app.send_static_file('LOGIN/script.js')

if __name__ == '__main__':
    print("Starting MediVolt Password Reset API...")
    print("Configure SMTP settings in app.py for real email sending")
    app.run(debug=True, port=5000)
