import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration."""
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=5)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('URL_DB')


"""Si posssono elencare le vare configurazioni come per esempio Config di test Config di Produzione"""
