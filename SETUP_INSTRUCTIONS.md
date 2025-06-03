# Setting Up Password Recovery System

## 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in methods
   - Enable "Phone" and "Email/Password" providers
4. Get Service Account Credentials:
   - Go to Project Settings > Service accounts
   - Click "Generate New Private Key"
   - Save the JSON file securely
   - Set FIREBASE_CREDENTIALS_PATH in .env to point to this file

## 2. Twilio Setup (Optional - Fallback for OTP)

1. Sign up for a [Twilio Account](https://www.twilio.com/try-twilio)
2. Get your credentials from the Twilio Console:
   - Account SID
   - Auth Token
   - Twilio Phone Number
3. Add these to your .env file:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

## 3. Email Setup

1. For Gmail:
   - Enable 2-factor authentication
   - Generate an App Password
   - Add to .env:
     ```
     MAIL_SERVER=smtp.gmail.com
     MAIL_PORT=587
     MAIL_USE_TLS=True
     MAIL_USERNAME=your-email@gmail.com
     MAIL_PASSWORD=your-app-specific-password
     MAIL_DEFAULT_SENDER=your-email@gmail.com
     ```

## 4. Environment Setup

1. Copy .env.example to .env:
   ```bash
   copy .env.example .env
   ```

2. Update .env with all credentials:
   - Firebase credentials path
   - Twilio credentials
   - Email settings
   - Secret key

## 5. Install Dependencies

```bash
pip install -r requirements.txt
```

## Testing the System

1. **Email Recovery:**
   - Click "Forgot Password" on login page
   - Enter registered email
   - Check email for reset link
   - Click link and set new password

2. **Phone Recovery:**
   - Click "Forgot Password" on login page
   - Enter registered phone number
   - Enter OTP received via SMS
   - Set new password

## Security Notes

- OTP expires after 30 minutes
- Rate limiting is enabled (5 attempts per hour)
- Account lockout after 5 failed attempts
- All tokens use secure encryption
- Session data is cleared after use
