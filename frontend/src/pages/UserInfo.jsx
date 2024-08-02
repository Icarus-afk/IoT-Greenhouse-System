import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import { apiClientAuth, API_ENDPOINTS } from '../api/apiConfig';

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await apiClientAuth.get(API_ENDPOINTS.GET_USER_INFO);
        setUserInfo(response.data.data);
      } catch (error) {
        setError('Failed to fetch user info.');
      }
    };

    fetchUserInfo();
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleUpdateClick = () => {
    navigate('/update-user-info'); // Adjust the path as needed
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="h4">User Info</Typography>
        {userInfo ? (
          <Paper sx={{ padding: 4, marginTop: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Username: {userInfo.username}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Email: {userInfo.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">First Name: {userInfo.first_name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Last Name: {userInfo.last_name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Age: {userInfo.age}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6">Address: {userInfo.address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Joined: {userInfo.joined}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                  Update Info
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default UserInfo;
