from flask import Flask, request, jsonify, render_template
import joblib
import requests

app = Flask(__name__)

# Load the trained model
model = joblib.load('random_forest_model.pkl')

# ThingSpeak API parameters
THINGSPEAK_API_KEY = 'JRUOZ5SJBVGBMPDL'
CHANNEL_ID = '2325376'

@app.route('/')
def index():
    # Render the HTML template
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Fetch data from ThingSpeak API
    url = f'https://api.thingspeak.com/channels/{CHANNEL_ID}/feeds.json?api_key={THINGSPEAK_API_KEY}&results=2'
    response = requests.get(url)
    data = response.json()['feeds'][0]

    # Extract sensor data
    temperature = float(data['field1'])
    soil_moisture = float(data['field3'])
    humidity = float(data['field2'])

    # Make prediction using the model
    prediction = model.predict([[temperature, soil_moisture, humidity]])

    # Return the prediction as JSON response
    return jsonify({'water_requirement': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
