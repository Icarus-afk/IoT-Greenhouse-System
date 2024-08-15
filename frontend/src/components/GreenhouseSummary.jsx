import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Card, CardContent, CardActions, Button, Collapse } from '@mui/material';
import GreenhouseCard from './GreenhouseCard';
import DeviceCard from './DeviceCard'; // Import the DeviceCard component
import { apiClientAuth, API_ENDPOINTS } from '../api/apiConfig';

const GreenhouseSummary = () => {
  const [greenhouses, setGreenhouses] = useState([]);
  const [openGreenhouseId, setOpenGreenhouseId] = useState(null);

  useEffect(() => {
    const fetchGreenhouseData = async () => {
      try {
        const response = await apiClientAuth.get(API_ENDPOINTS.DEVICE_DETAILS);
        const { data } = response.data;
        console.log('Fetched Greenhouse Data:', data); // Log the fetched data
        setGreenhouses(data);
        localStorage.setItem('user_access_list', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to fetch greenhouse data', error);
      }
    };

    fetchGreenhouseData();
  }, []);

  const handleToggle = (id) => {
    setOpenGreenhouseId(openGreenhouseId === id ? null : id);
  };

  return (
    <Container sx={{ mt: 12, mb: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Greenhouses
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {greenhouses.map((greenhouse) => (
          <Grid item xs={12} sm={6} md={4} key={greenhouse.id}>
            <Card>
              <CardContent>
                <GreenhouseCard greenhouse={greenhouse} />
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleToggle(greenhouse.id)}>
                  {openGreenhouseId === greenhouse.id ? 'Close' : 'Open'}
                </Button>
              </CardActions>
              <Collapse in={openGreenhouseId === greenhouse.id} timeout="auto" unmountOnExit>
                <CardContent>
                  <DeviceCard device={greenhouse.device} lastKnownData={greenhouse.lastKnownData} />
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GreenhouseSummary;