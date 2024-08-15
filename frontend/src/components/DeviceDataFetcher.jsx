import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Typography, TextField, Button, Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { apiClientAuth, API_ENDPOINTS } from '../api/apiConfig';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';

const DeviceDataFetcher = ({ filters, setFilters }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [error, setError] = useState('');
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');

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
                setError('');
            } else {
                setError('Failed to fetch data');
            }
        } catch (error) {
            console.error('Failed to fetch device data', error);
            setError('Failed to fetch data');
        }
    };

    const fetchDevices = () => {
        const storedData = JSON.parse(localStorage.getItem('user_access_list') || '[]');
        setDevices(storedData.map(device => ({ id: device.device.id, name: device.device.name })));
    };

    useEffect(() => {
        fetchDevices();
        fetchDeviceData();
    }, [page, pageSize]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleDeviceChange = (e) => {
        const deviceId = e.target.value;
        setSelectedDevice(deviceId);
        setFilters({ ...filters, device_id: deviceId });
    };

    const applyFilters = () => {
        fetchDeviceData();
    };

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
                <Button variant="contained" color="primary" onClick={applyFilters} startIcon={<FilterListIcon />}>
                    Apply Filters
                </Button>
                <Button variant="outlined" color="secondary" onClick={resetFilters} startIcon={<RefreshIcon />}>
                    Reset Filters
                </Button>
            </Box>

            {error && <Typography color="error">{error}</Typography>}

            <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Device ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Device Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Timestamp</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Temperature</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Humidity</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Soil Moisture</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Rain Level</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Light Lux</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow
                                    key={item.timestamp}
                                    sx={{
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: '#f9f9f9',
                                        },
                                        '&:hover': {
                                            backgroundColor: '#e0e0e0',
                                        },
                                    }}
                                >
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
            </Box>

            <Pagination
                count={Math.ceil(count / pageSize)}
                page={page}
                onChange={handlePageChange}
                sx={{ m: 2, display: 'flex', justifyContent: 'center' }}
            />
        </>
    );
};

export default DeviceDataFetcher;