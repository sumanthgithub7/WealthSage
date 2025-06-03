from flask import Flask, redirect, render_template, session
from config import DB_URI, SECRET_KEY
from models import db
from auth.routes import auth

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = SECRET_KEY
db.init_app(app)

app.register_blueprint(auth)

@app.route('/')
def home():
    return redirect('/login')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect('/login')
    return render_template('dashboard.html', role=session.get('user_role'))
if __name__ == '__main__':
    app.run(debug=True)