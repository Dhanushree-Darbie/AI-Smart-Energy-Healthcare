# MediVolt - Forgot Password Setup Guide

## Quick Start

### 1. Install Python Dependencies
Open terminal/command prompt and run:
```
bash
cd LOGIN
pip install flask
```

### 2. Configure Email Settings
Edit `app.py` and update these lines with your email:
```
python
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "your_email@gmail.com"
SENDER_PASSWORD = "your_app_password"
```

**Note:** For Gmail, use an "App Password" (16 characters) - get it from your Google Account > Security > 2-Step Verification > App Passwords

### 3. Start the API Server
```
bash
python app.py
```
The API will run at: `http://localhost:5000`

### 4. Open the Website
Open `login.html` in your browser:
- Click "Forgot password?"
- Enter email and phone
- Click "Send OTP"
- Check your email for the OTP
- Enter OTP and set new password

## If API is Not Running
The forgot password page works in "demo mode" - it will show the OTP in an alert popup instead of sending an email.

## API Endpoints
- `POST /api/send-otp` - Send OTP to email
- `POST /api/verify-otp` - Verify OTP
- `POST /api/reset-password` - Reset password

## Files Created
- `app.py` - Flask API server
- `requirements.txt` - Python dependencies
- `forgot-password.html` - Password reset page
- `login.html` - Updated with forgot password link
