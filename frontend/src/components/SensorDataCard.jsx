// SensorDataCard.jsx

const SensorDataCard = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sensor-data-card">
      <h3>Sensor Data</h3>
      <p>Temperature: {data.temperature}</p>
      <p>Humidity: {data.humidity}</p>
      <p>Soil Moisture: {data.soil_moisture}</p>
      <p>Rain Level: {data.rain_level}</p>
      <p>Light Lux: {data.light_lux}</p>
      <p>Device ID: {data.device_id}</p>
    </div>
  );
};

export default SensorDataCard;