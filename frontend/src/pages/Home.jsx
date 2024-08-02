// src/pages/Home.jsx
import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import GreenhouseSummary from '../components/GreenhouseSummary';
import DeviceDataFetcher from '../components/DeviceDataFetcher';

const Home = () => {
  const [filters, setFilters] = useState({
    device_id: '',
    start_date: '',
    end_date: '',
  });

  return (
    <>
      <GreenhouseSummary />
      <Container>
        <Typography variant="h4" gutterBottom>
          Device Data
        </Typography>
        <DeviceDataFetcher filters={filters} setFilters={setFilters} />
      </Container>
    </>
  );
};

export default Home;
