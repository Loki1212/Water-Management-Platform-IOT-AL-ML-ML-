function fetchSensorData() {
    // Fetch sensor data from ThingSpeak
    fetch('https://api.thingspeak.com/channels/2325376/feeds.json?api_key=JRUOZ5SJBVGBMPDL&results=2')
    .then(response => response.json())
    .then(data => {
        // Extract sensor data
        const temperature = data.feeds[0].field1;
        const soilMoisture = data.feeds[0].field2;
        const humidity = data.feeds[0].field3;

        // Display sensor data
        document.getElementById('sensorData').innerHTML = `
            <h2>Latest Sensor Data</h2>
            <table>
                <tr>
                    <th>Temperature (°C)</th>
                    <th>Soil Moisture (%)</th>
                    <th>Humidity (%)</th>
                </tr>
                <tr>
                    <td>${temperature}</td>
                    <td>${humidity}</td>
                    <td>${soilMoisture}</td>
                </tr>
            </table>
        `;
    })
    .catch(error => console.error('Error:', error));
}

function predictWaterRequirement() {
    // Get form data
    var form = document.getElementById('waterForm');
    var formData = new FormData(form);

    // Make prediction request
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Calculate time for water motor to be on
        const waterRequirement = parseFloat(data.water_requirement);
        const flowRate = 100; // Flow rate in liters per minute
        const time = waterRequirement / (flowRate / 60); // Convert flow rate to liters per second
        const timeInMinutes = Math.round(time);

        // Display prediction result and time
        document.getElementById('result').innerHTML = `Predicted Water Requirement: ${waterRequirement} L<br>Time for Water Motor: ${timeInMinutes} minutes`;

        // Write data to ThingSpeak
        writeDataToThingSpeak(waterRequirement, timeInMinutes);
    })
    .catch(error => console.error('Error:', error));
}

function writeDataToThingSpeak(waterRequirement, time) {
    // Create the URL for writing data to ThingSpeak
    const url = `https://api.thingspeak.com/update?api_key=2D14IWEZ0AKP91QM&field4=${waterRequirement}&field5=${time}`;

    // Make a POST request to write data
    fetch(url, {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to write data to ThingSpeak');
        }
    })
    .catch(error => console.error('Error writing data to ThingSpeak:', error));
}
