from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS


# Instantiate the extensions
db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()


def init_app(app):

    jwt.init_app(app)
    db.init_app(app)

    # Configure CORS to allow requests from specific origins
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:5173"}})
