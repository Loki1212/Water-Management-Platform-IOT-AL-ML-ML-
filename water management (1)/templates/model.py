import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import joblib

# Load dataset
dataset = pd.read_csv('model_predictions.csv')

# Define features (X) and target variable (y)
X = dataset[['temperature', 'soil_moisture', 'humidity']]
y = dataset['water_requirement']

# Split dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize Random Forest model
model = RandomForestRegressor(n_estimators=100, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Make predictions on the testing set
y_pred = model.predict(X_test)

# Evaluate the model
mae = mean_absolute_error(y_test, y_pred)
print('Mean Absolute Error:', mae)

# Save the trained model
joblib.dump(model, 'random_forest_model.pkl')
