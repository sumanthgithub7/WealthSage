from datetime import datetime
from flask import Blueprint, render_template, redirect, url_for, flash, request, session
from flask_login import login_user, logout_user, login_required, current_user
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from urllib.parse import urlparse
from models import User, db
from auth.forms import LoginForm, RegistrationForm, ForgotPasswordForm, ResetPasswordForm
from auth.utils import send_password_reset_email, generate_otp, send_otp_sms

auth = Blueprint('auth', __name__)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=['100 per day', '10 per minute']
)

@auth.route('/login', methods=['GET', 'POST'])
@limiter.limit('5 per minute')
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.is_locked():
            flash('Account is temporarily locked due to too many failed attempts. Try again later.')
            return redirect(url_for('auth.login'))
        
        if user is None or not user.check_password(form.password.data):
            if user:
                user.increment_failed_attempts()
            flash('Invalid email or password')
            return redirect(url_for('auth.login'))
        
        # Reset failed attempts on successful login
        user.reset_failed_attempts()
        login_user(user)
        next_page = request.args.get('next')
        if not next_page or urlparse(next_page).netloc != '':
            next_page = url_for('dashboard')
        return redirect(next_page)
    return render_template('auth/login.html', title='Sign In', form=form)

@auth.route('/register', methods=['GET', 'POST'])
@limiter.limit('20 per day')
def register():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            email=form.email.data,
            phone=form.phone.data
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('auth.login'))
    return render_template('auth/register.html', title='Register', form=form)

@auth.route('/forgot-password', methods=['GET', 'POST'])
@limiter.limit('5 per hour')
def forgot_password():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    form = ForgotPasswordForm()
    if form.validate_on_submit():
        identifier = form.email_or_phone.data
        user = User.query.filter((User.email == identifier) | 
                               (User.phone == identifier)).first()
        if user:
            if '@' in identifier:  # Email
                send_password_reset_email(user)
                flash('Check your email for instructions to reset your password')
            else:  # Phone
                otp = generate_otp()
                session['reset_otp'] = otp
                session['reset_phone'] = identifier
                session['reset_otp_time'] = datetime.utcnow().timestamp()
                send_otp_sms(identifier, otp)
                flash('An OTP has been sent to your phone')
                return redirect(url_for('auth.verify_otp'))
        else:
            flash('No account found with that email or phone number')
    return render_template('auth/forgot_password.html', title='Forgot Password', form=form)

@auth.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    user = User.verify_reset_token(token)
    if not user:
        flash('Invalid or expired reset token')
        return redirect(url_for('auth.forgot_password'))
    form = ResetPasswordForm()
    if form.validate_on_submit():
        user.set_password(form.password.data)
        db.session.commit()
        flash('Your password has been reset')
        return redirect(url_for('auth.login'))
    return render_template('auth/reset_password.html', form=form)

@auth.route('/verify-otp', methods=['GET', 'POST'])
def verify_otp():
    if 'reset_otp' not in session:
        return redirect(url_for('auth.forgot_password'))
    
    if request.method == 'POST':
        otp = request.form.get('otp')
        if otp == session['reset_otp']:
            # Check if OTP is still valid (30 minutes)
            otp_time = session['reset_otp_time']
            if datetime.utcnow().timestamp() - otp_time > 1800:
                flash('OTP has expired')
                return redirect(url_for('auth.forgot_password'))
            
            # Clear OTP session data
            phone = session.pop('reset_phone')
            session.pop('reset_otp')
            session.pop('reset_otp_time')
            
            # Generate a token for password reset
            user = User.query.filter_by(phone=phone).first()
            if user:
                token = user.get_reset_token()
                return redirect(url_for('auth.reset_password', token=token))
        
        flash('Invalid OTP')
    return render_template('auth/verify_otp.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))