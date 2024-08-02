import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AgricultureIcon from '@mui/icons-material/Agriculture';

const GreenhouseCard = ({ greenhouse }) => {
  const { name, location, device, crop } = greenhouse;

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="textSecondary">
            {location}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <DeviceHubIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="textSecondary">
            Device: {device.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="textSecondary">
            Last Seen: {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AgricultureIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="textSecondary">
            Crop: {crop.name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GreenhouseCard;
