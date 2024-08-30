import React, { useEffect, useState } from 'react';
import WebSocketManager from '../utils/websockManager';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';
import './DeviceCard.css';

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
            const url = `ws://127.0.0.1:8001/ws/sensor_data/?token=${token}`;
            console.log('Connecting to WebSocket:', url);
            WebSocketManager.connect(url, token);
        }

        return () => {
            console.log('Disconnecting WebSocket');
            WebSocketManager.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!device) {
            console.error('Device prop is undefined');
            return;
        }

        const handleMessage = (message) => {
            console.log('Received message:', message);
            const data = JSON.parse(message);
            if (data.device_id === device.device_id) {
                console.log('Matching device_id:', data.device_id);
                setLatestData(data);
            } else {
                console.log('Non-matching device_id:', data.device_id);
            }
        };

        WebSocketManager.addListener(handleMessage);

        return () => {
            WebSocketManager.removeListener(handleMessage);
        };
    }, [device]);

    const animatedTemperature = useSpring({ value: latestData.temperature, from: { value: 0 } });
    const animatedHumidity = useSpring({ value: latestData.humidity, from: { value: 0 } });
    const animatedSoilMoisture = useSpring({ value: latestData.soil_moisture, from: { value: 0 } });
    const animatedRainLevel = useSpring({ value: latestData.rain_level, from: { value: 0 } });
    const animatedLightLux = useSpring({ value: latestData.light_lux, from: { value: 0 } });

    if (!device) {
        return <div>Error: Device not found</div>;
    }
    
    return (
        <Box className="device-card-container">
            {console.log('Rendering data:', latestData)}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card className="device-card">
                        <CardContent>
                            <Typography className="device-card-title" variant="h6">Temperature</Typography>
                            <animated.div className="device-card-value">{animatedTemperature.value.to(val => `${val.toFixed(2)}°C`)}</animated.div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className="device-card">
                        <CardContent>
                            <Typography className="device-card-title" variant="h6">Humidity</Typography>
                            <animated.div className="device-card-value">{animatedHumidity.value.to(val => `${val.toFixed(2)}%`)}</animated.div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className="device-card">
                        <CardContent>
                            <Typography className="device-card-title" variant="h6">Soil Moisture</Typography>
                            <animated.div className="device-card-value">{animatedSoilMoisture.value.to(val => `${val.toFixed(2)}%`)}</animated.div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className="device-card">
                        <CardContent>
                            <Typography className="device-card-title" variant="h6">Rain Level</Typography>
                            <animated.div className="device-card-value">{animatedRainLevel.value.to(val => `${val.toFixed(2)}%`)}</animated.div>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className="device-card">
                        <CardContent>
                            <Typography className="device-card-title" variant="h6">Light Intensity</Typography>
                            <animated.div className="device-card-value">{animatedLightLux.value.to(val => `${val.toFixed(2)} lux`)}</animated.div>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DeviceCard;