from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, ValidationError
from wtforms.validators import DataRequired, Email, Length, EqualTo, Regexp
from models import User

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[
        DataRequired(),
        Length(min=2, max=50),
        Regexp(r'^[\w.]+$', message='Username can only contain letters, numbers, and dots.')
    ])
    email = StringField('Email', validators=[DataRequired(), Email()])
    phone = StringField('Phone Number', validators=[
        DataRequired(),
        Regexp(r'^\+?[1-9]\d{9,14}$', message='Invalid phone number format. Must be 10-15 digits with optional + prefix.')
    ])
    password = PasswordField('Password', validators=[
        DataRequired(),
        Length(min=6, message='Password must be at least 6 characters long'),
        Regexp(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$',
               message='Password must contain at least one letter and one number')
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(),
        EqualTo('password', message='Passwords must match')
    ])
    submit = SubmitField('Register')

    def validate_email(self, field):
        if User.query.filter_by(email=field.data).first():
            raise ValidationError('Email already registered.')

    def validate_phone(self, field):
        if User.query.filter_by(phone=field.data).first():
            raise ValidationError('Phone number already registered.')

class ForgotPasswordForm(FlaskForm):
    email_or_phone = StringField('Email or Phone Number', validators=[DataRequired()])
    submit = SubmitField('Send Reset Link')

class ResetPasswordForm(FlaskForm):
    password = PasswordField('New Password', validators=[
        DataRequired(),
        Length(min=6, message='Password must be at least 6 characters long'),
        Regexp(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$',
               message='Password must contain at least one letter and one number')
    ])
    confirm_password = PasswordField('Confirm New Password', validators=[
        DataRequired(),
        EqualTo('password', message='Passwords must match')
    ])
    submit = SubmitField('Reset Password')
