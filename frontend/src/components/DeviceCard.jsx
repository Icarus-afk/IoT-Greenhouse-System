import { useEffect, useState } from 'react';
import WebSocketManager from '../utils/websockManager';
import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Box, Typography } from '@mui/material';

const DeviceCard = ({ device }) => {
    const [latestData, setLatestData] = useState({
        temperature: 0,
        humidity: 0,
        soil_moisture: 0,
        rain_level: 0,
        light_lux: 0
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        setIsAuthenticated(!!token);

        if (token) {
            // Establish WebSocket connection with token as query parameter
            const url = `ws://127.0.0.1:8001/ws/sensor_data/?token=${token}`;
            console.log('Connecting to WebSocket:', url); // Debugging log
            WebSocketManager.connect(url, token);
        }

        return () => {
            console.log('Disconnecting WebSocket'); // Debugging log
            WebSocketManager.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!device) {
            console.error('Device prop is undefined'); // Debugging log
            return;
        }

        const handleMessage = (message) => {
            console.log('Received message:', message); // Debugging log
            const data = JSON.parse(message);
            if (data.device_id === device.device_id) {
                console.log('Matching device_id:', data.device_id); // Debugging log
                setLatestData(data);
            } else {
                console.log('Non-matching device_id:', data.device_id); // Debugging log
            }
        };

        WebSocketManager.addListener(handleMessage);

        return () => {
            WebSocketManager.removeListener(handleMessage);
        };
    }, [device]);

    if (!device) {
        return <div>Error: Device not found</div>;
    }

    return (
        <div>
            <Box>
                {console.log('Rendering data:', latestData)} {/* Debugging log */}
                <Box mb={2}>
                    <Typography variant="h6">Temperature</Typography>
                    <ProgressBar
                        now={latestData.temperature}
                        label={<span className="progress-label">{`${latestData.temperature}°C`}</span>}
                        className="progress"
                    />
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Humidity</Typography>
                    <ProgressBar
                        now={latestData.humidity}
                        label={<span className="progress-label">{`${latestData.humidity}%`}</span>}
                        className="progress"
                    />
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Soil Moisture</Typography>
                    <ProgressBar
                        now={latestData.soil_moisture}
                        label={<span className="progress-label">{`${latestData.soil_moisture}%`}</span>}
                        className="progress"
                    />
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Rain Level</Typography>
                    <ProgressBar
                        now={latestData.rain_level}
                        label={<span className="progress-label">{`${latestData.rain_level}mm`}</span>}
                        className="progress"
                    />
                </Box>
                <Box mb={2}>
                    <Typography variant="h6">Light Intensity</Typography>
                    <ProgressBar
                        now={latestData.light_lux / 100}
                        label={<span className="progress-label">{`${latestData.light_lux} lux`}</span>}
                        className="progress"
                    />
                </Box>
            </Box>
        </div>
    );
};

export default DeviceCard;