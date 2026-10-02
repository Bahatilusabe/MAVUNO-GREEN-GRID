# API Routes
from flask import Blueprint, jsonify

api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@api_bp.route('/version', methods=['GET'])
def get_version():
    return jsonify({'version': '1.0.0'}), 200
