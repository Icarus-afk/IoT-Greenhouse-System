import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiClientAuth, API_ENDPOINTS } from '../api/apiConfig';

const UpdateUserInfo = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    age: '',
    address: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await apiClientAuth.get(API_ENDPOINTS.GET_USER_INFO);
        setFormData(response.data.data);
      } catch (error) {
        setError('Failed to fetch user info.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClientAuth.put(API_ENDPOINTS.UPDATE_USER_INFO, formData);
      alert('User info updated successfully');
      navigate('/user-info');
    } catch (error) {
      setError('Failed to update user info.');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        position: 'relative',
        top: '80px', // Adjusted to account for Navbar height
        paddingBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 80px)', // Adjusting height to center the form vertically
      }}
    >
      <Paper elevation={4} sx={{ padding: 4, borderRadius: '8px', width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Update User Info
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            name="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            name="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            name="age"
            label="Age"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ marginTop: 2 }}
          >
            Update
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UpdateUserInfo;
