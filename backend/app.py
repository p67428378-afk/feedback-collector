import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from backend.config import Config
from backend.models import db
from backend.routes import api_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate = Migrate(app, db)
    CORS(app) # Enable CORS for all routes

    app.register_blueprint(api_bp)

    @app.route('/')
    def health_check():
        return jsonify({'status': 'ok', 'message': 'Feedback Collector API is running!'})

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)
