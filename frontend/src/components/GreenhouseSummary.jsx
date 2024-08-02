import { useState, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import GreenhouseCard from './GreenhouseCard';
import { apiClientAuth, API_ENDPOINTS } from '../api/apiConfig';

const GreenhouseSummary = () => {
  const [greenhouses, setGreenhouses] = useState([]);

  useEffect(() => {
    const fetchGreenhouseData = async () => {
      try {
        const response = await apiClientAuth.get(API_ENDPOINTS.DEVICE_DETAILS);
        setGreenhouses(response.data.data);
      } catch (error) {
        console.error('Failed to fetch greenhouse data', error);
      }
    };

    fetchGreenhouseData();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Greenhouses
      </Typography>
      <Grid container spacing={2}>
        {greenhouses.map((greenhouse) => (
          <Grid item xs={12} sm={6} md={4} key={greenhouse.id}>
            <GreenhouseCard greenhouse={greenhouse} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GreenhouseSummary;
