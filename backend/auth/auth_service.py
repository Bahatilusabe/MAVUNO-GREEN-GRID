# Authentication Module
import jwt
from datetime import datetime, timedelta

class AuthService:
    def __init__(self, secret_key):
        self.secret_key = secret_key
    
    def generate_token(self, user_id, expires_in=3600):
        payload = {
            'user_id': user_id,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(seconds=expires_in)
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
    
    def verify_token(self, token):
        try:
            return jwt.decode(token, self.secret_key, algorithms=['HS256'])
        except jwt.InvalidTokenError:
            return None
