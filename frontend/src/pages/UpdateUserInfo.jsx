import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
  const navigate = useNavigate(); // Initialize useNavigate

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
      navigate('/user-info'); // Redirect to the user info page
    } catch (error) {
      setError('Failed to update user info.');
    }
  };

  return (
    <Container>
      <Typography variant="h4">Update User Info</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          name="first_name"
          label="First Name"
          value={formData.first_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="last_name"
          label="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="age"
          label="Age"
          value={formData.age}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="address"
          label="Address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Update
        </Button>
      </form>
    </Container>
  );
};

export default UpdateUserInfo;
