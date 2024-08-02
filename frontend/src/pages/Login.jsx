import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { apiClientNoAuth, API_ENDPOINTS } from '../api/apiConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await apiClientNoAuth.post(API_ENDPOINTS.LOGIN, { username, password });
      const { data } = response.data;

      // Save tokens to localStorage
      localStorage.setItem('jwt', data.jwt);
      localStorage.setItem('refresh', data.refresh);

      // Navigate to user info page or home page
      navigate('/home');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="h5">Login</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
