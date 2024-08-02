import React from 'react';
import { Card, CardContent, Typography, Box, Divider, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import CircleIcon from '@mui/icons-material/Circle';

const GreenhouseCard = ({ greenhouse }) => {
  const { name, location, device, crop, timestamp } = greenhouse;
  const isOnline = device.is_online ? 'Online' : 'Offline';
  const lastSeen = device.last_seen ? new Date(device.last_seen).toLocaleString() : 'N/A';

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {name}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="textSecondary">
            Location: {location}
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
            Last Seen: {lastSeen}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CircleIcon sx={{ mr: 1, color: isOnline === 'Online' ? 'green' : 'red' }} />
          <Typography variant="body2" color="textSecondary">
            Status: {isOnline}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AgricultureIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="textSecondary">
            Crop: {crop.name}
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary">
          Last Update: {new Date(timestamp).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GreenhouseCard;
