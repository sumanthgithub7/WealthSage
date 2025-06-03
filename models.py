from datetime import datetime, timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app
from time import time
import jwt

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    failed_login_attempts = db.Column(db.Integer, default=0)
    last_failed_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_reset_token(self, expires_in=1800):
        return jwt.encode(
            {'reset_password': self.id, 'exp': time() + expires_in},
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )

    @staticmethod
    def verify_reset_token(token):
        try:
            id = jwt.decode(token, current_app.config['SECRET_KEY'],
                          algorithms=['HS256'])['reset_password']
        except:
            return None
        return User.query.get(id)

    def increment_failed_attempts(self):
        self.failed_login_attempts = (self.failed_login_attempts or 0) + 1
        self.last_failed_login = datetime.utcnow()
        db.session.commit()

    def reset_failed_attempts(self):
        self.failed_login_attempts = 0
        self.last_failed_login = None
        self.last_login = datetime.utcnow()
        db.session.commit()

    def is_locked(self):
        if not self.failed_login_attempts or self.failed_login_attempts < 5:
            return False
        
        if not self.last_failed_login:
            return False
        
        # Account is locked for 15 minutes after 5 failed attempts
        lock_duration = timedelta(minutes=15)
        return datetime.utcnow() - self.last_failed_login < lock_duration