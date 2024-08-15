import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClientNoAuth, API_ENDPOINTS } from '../api/apiConfig';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    age: '',
    address: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClientNoAuth.post(API_ENDPOINTS.SIGNUP, formData);
      navigate('/login');
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              name={key}
              label={key.replace('_', ' ').toUpperCase()}
              value={formData[key]}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required={['username', 'password', 'email'].includes(key)}
            />
          ))}
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account? <Link onClick={handleLoginClick} sx={{ cursor: 'pointer' }}>Log in</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
