# Forecasting Models

import numpy as np
from sklearn.ensemble import RandomForestRegressor

class YieldForecaster:
    def __init__(self):
        self.model = RandomForestRegressor()
    
    def train(self, X, y):
        """Train yield forecasting model"""
        self.model.fit(X, y)
    
    def predict(self, X):
        """Predict yield"""
        return self.model.predict(X)
    
    def get_feature_importance(self):
        """Get feature importance scores"""
        return self.model.feature_importances_
