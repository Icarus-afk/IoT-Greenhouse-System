// src/components/DeviceDataFetcher.jsx
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Typography, TextField, Button, Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { apiClientAuth, API_ENDPOINTS } from '../api/apiConfig';

const DeviceDataFetcher = ({ filters, setFilters }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [error, setError] = useState('');
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');

    // Fetch device data from API and update state
    const fetchDeviceData = async () => {
        try {
            const params = {
                page,
                page_size: pageSize,
                ...(filters.device_id && { device_id: filters.device_id }),
                ...(filters.start_date && { start_date: filters.start_date }),
                ...(filters.end_date && { end_date: filters.end_date }),
            };

            const response = await apiClientAuth.get(API_ENDPOINTS.GET_DEVICE_DATA, { params });
            if (response.data.success) {
                setData(response.data.data.results);
                setCount(response.data.data.count);
                setError(''); // Clear error message if data fetch is successful
            } else {
                setError('Failed to fetch data');
            }
        } catch (error) {
            console.error('Failed to fetch device data', error);
            setError('Failed to fetch data');
        }
    };

    // Fetch devices from local storage
    const fetchDevices = () => {
        const storedData = JSON.parse(localStorage.getItem('user_access_list') || '[]');
        setDevices(storedData.map(device => ({ id: device.device.id, name: device.device.name })));
    };

    useEffect(() => {
        fetchDevices();
        fetchDeviceData();
    }, [page, pageSize, filters]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Handle page changes
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Handle device selection
    const handleDeviceChange = (e) => {
        const deviceId = e.target.value;
        setSelectedDevice(deviceId);
        setFilters({ ...filters, device_id: deviceId });
    };

    // Apply filters and fetch data
    const applyFilters = () => {
        fetchDeviceData();
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            device_id: '',
            start_date: '',
            end_date: '',
        });
        setSelectedDevice('');
        fetchDeviceData();
    };

    return (
        <>
            <Box component="form" sx={{ mb: 2, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
                <FormControl variant="outlined" sx={{ flex: 1, minWidth: 200 }}>
                    <InputLabel>Device</InputLabel>
                    <Select
                        value={selectedDevice}
                        onChange={handleDeviceChange}
                        label="Device"
                    >
                        {devices.map((device) => (
                            <MenuItem key={device.id} value={device.id}>
                                {device.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    name="start_date"
                    label="Start Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.start_date}
                    onChange={handleFilterChange}
                    sx={{ flex: 1, minWidth: 150 }}
                />
                <TextField
                    name="end_date"
                    label="End Date"
                    variant="outlined"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.end_date}
                    onChange={handleFilterChange}
                    sx={{ flex: 1, minWidth: 150 }}
                />
                <Button variant="contained" color="primary" onClick={applyFilters}>
                    Apply Filters
                </Button>
                <Button variant="outlined" color="secondary" onClick={resetFilters}>
                    Reset Filters
                </Button>
            </Box>

            {error && <Typography color="error">{error}</Typography>}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Device ID</TableCell>
                            <TableCell>Device Name</TableCell>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Temperature</TableCell>
                            <TableCell>Humidity</TableCell>
                            <TableCell>Soil Moisture</TableCell>
                            <TableCell>Rain Level</TableCell>
                            <TableCell>Light Lux</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.timestamp}>
                                <TableCell>{item.device_id}</TableCell>
                                <TableCell>{item.device_name}</TableCell>
                                <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{item.temperature}</TableCell>
                                <TableCell>{item.humidity}</TableCell>
                                <TableCell>{item.soil_moisture}</TableCell>
                                <TableCell>{item.rain_level}</TableCell>
                                <TableCell>{item.light_lux}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                count={Math.ceil(count / pageSize)}
                page={page}
                onChange={handlePageChange}
                sx={{ mt: 2 }}
            />
        </>
    );
};

export default DeviceDataFetcher;
