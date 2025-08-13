from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, auth
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate("path/to/your/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

# Configure SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User Model
class User(db.Model):
    id = db.Column(db.String(128), primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    picture = db.Column(db.String(255))

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    try:
        # Get the ID token from the request
        id_token = request.json.get('idToken')
        if not id_token:
            return jsonify({'error': 'No ID token provided'}), 400

        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        # Get user info
        user = User.query.get(uid)
        
        if not user:
            # Create new user if they don't exist
            user = User(
                id=uid,
                email=decoded_token.get('email'),
                name=decoded_token.get('name'),
                picture=decoded_token.get('picture')
            )
            db.session.add(user)
            db.session.commit()

        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'picture': user.picture
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
