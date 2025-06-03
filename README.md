# User Authentication System

A Flask-based user authentication system with login, registration, and user dashboard functionality.

## Features

- User registration with email verification
- Secure login system with rate limiting
- User dashboard
- Role-based access control (User/Admin)
- Bootstrap-based responsive UI
- Password recovery system:
  - Email-based reset links using Firebase Auth
  - Phone-based OTP verification using Twilio
  - Rate-limited requests
  - 30-minute token expiration

## Prerequisites

- Python 3.8+
- MySQL Server
- Firebase account with Authentication enabled
- Twilio account with SMS capabilities

## Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create MySQL database:
   ```sql
   CREATE DATABASE user_auth;
   ```

5. Copy `.env.example` to `.env` and update with your credentials:
   - Database credentials
   - Secret key
   - Firebase configuration
   - Twilio API credentials
   - SMTP settings for email

6. Initialize the database:
   ```
   python init_db.py
   ```

7. Run the application:
   ```
   python app.py
   ```

8. Visit `http://localhost:5000` in your browser

## Project Structure

```
user_auth/
├── auth/
│   ├── forms.py
│   └── routes.py
├── static/
│   └── css/
│       └── style.css
├── templates/
│   ├── base.html
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
├── .env
├── app.py
├── config.py
├── models.py
├── init_db.py
└── requirements.txt
```

## Security Features

- Password hashing using Werkzeug
- CSRF protection
- Secure session handling
- SQL injection prevention through SQLAlchemy
- Rate limiting for sensitive operations
- Secure password recovery:
  - Time-limited reset tokens
  - Firebase Authentication integration
  - Twilio verified phone numbers
  - Account lockout after failed attempts
