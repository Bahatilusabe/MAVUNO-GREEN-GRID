# Database Seed Service

class DatabaseSeeder:
    def __init__(self, db_connection):
        self.db = db_connection
    
    def seed_users(self):
        """Seed sample users"""
        users = [
            {'username': 'farmer1', 'email': 'farmer1@example.com', 'role': 'farmer'},
            {'username': 'partner1', 'email': 'partner1@example.com', 'role': 'partner'},
        ]
        # Insert into database
    
    def seed_farms(self):
        """Seed sample farms"""
        # Implementation here
        pass
    
    def seed_crops(self):
        """Seed sample crops"""
        # Implementation here
        pass
