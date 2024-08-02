import { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import { apiClientAuth, API_ENDPOINTS } from '../api/apiConfig';
import GreenhouseSummary from '../components/GreenhouseSummary';

const Home = () => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    device_id: '',
    timestamp: '',
    temperature: '',
    humidity: '',
    soil_moisture: '',
    rain_level: '',
    light_lux: '',
  });
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const params = {
        page,
        page_size: pageSize,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)) // Remove empty filter fields
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

  useEffect(() => {
    fetchData();
  }, [page, pageSize, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
    <GreenhouseSummary />
    <Container>
      <Typography variant="h4" gutterBottom>
        Device Data
      </Typography>

      <Box component="form" sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          name="device_id"
          label="Device ID"
          variant="outlined"
          value={filters.device__device_id}
          onChange={handleFilterChange}
        />
        <TextField
          name="timestamp"
          label="Timestamp"
          variant="outlined"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={filters.timestamp}
          onChange={handleFilterChange}
        />
        <TextField
          name="temperature"
          label="Temperature"
          variant="outlined"
          value={filters.temperature}
          onChange={handleFilterChange}
        />
        <TextField
          name="humidity"
          label="Humidity"
          variant="outlined"
          value={filters.humidity}
          onChange={handleFilterChange}
        />
        <TextField
          name="soil_moisture"
          label="Soil Moisture"
          variant="outlined"
          value={filters.soil_moisture}
          onChange={handleFilterChange}
        />
        <TextField
          name="rain_level"
          label="Rain Level"
          variant="outlined"
          value={filters.rain_level}
          onChange={handleFilterChange}
        />
        <TextField
          name="light_lux"
          label="Light Lux"
          variant="outlined"
          value={filters.light_lux}
          onChange={handleFilterChange}
        />
        <Button variant="contained" color="primary" onClick={fetchData}>
          Apply Filters
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
    </Container>
    </>
  );
};

export default Home;
