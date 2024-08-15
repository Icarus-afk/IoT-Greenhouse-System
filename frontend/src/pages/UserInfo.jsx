import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Grid, Button, Card, CardContent, Avatar, IconButton } from '@mui/material';
import { apiClientAuth, API_ENDPOINTS } from '../api/apiConfig';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';

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
    <Container
      maxWidth="md"
      sx={{
        position: 'relative',
        top: '64px',
        paddingBottom: '20px',
        background: 'linear-gradient(to right, #ece9e6, #ffffff)',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        padding: '20px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          User Info
        </Typography>
        {userInfo ? (
          <Card
            sx={{
              width: '100%',
              padding: 4,
              marginTop: 4,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '12px',
              background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
          >
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6} md={4} sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ width: 120, height: 120, margin: '0 auto', backgroundColor: '#3f51b5' }}>
                    <AccountCircleIcon sx={{ fontSize: 100 }} />
                  </Avatar>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" display="flex" alignItems="center">
                        <PersonIcon sx={{ marginRight: 1, color: '#3f51b5' }} /> Username: {userInfo.username}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" display="flex" alignItems="center">
                        <EmailIcon sx={{ marginRight: 1, color: '#3f51b5' }} /> Email: {userInfo.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" display="flex" alignItems="center">
                        <PersonIcon sx={{ marginRight: 1, color: '#3f51b5' }} /> First Name: {userInfo.first_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" display="flex" alignItems="center">
                        <PersonIcon sx={{ marginRight: 1, color: '#3f51b5' }} /> Last Name: {userInfo.last_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" display="flex" alignItems="center">
                        <CakeIcon sx={{ marginRight: 1, color: '#3f51b5' }} /> Age: {userInfo.age}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" display="flex" alignItems="center">
                        <HomeIcon sx={{ marginRight: 1, color: '#3f51b5' }} /> Address: {userInfo.address}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" display="flex" alignItems="center">
                        <CalendarTodayIcon sx={{ marginRight: 1, color: '#3f51b5' }} /> Joined: {userInfo.joined}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateClick}
                        startIcon={<EditIcon />}
                        sx={{
                          borderRadius: '20px',
                          padding: '10px 20px',
                          background: 'linear-gradient(to right, #3f51b5, #5a55ae)',
                          '&:hover': {
                            background: 'linear-gradient(to right, #5a55ae, #3f51b5)',
                          },
                        }}
                      >
                        Update Info
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default UserInfo;
