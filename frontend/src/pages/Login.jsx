import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiClientNoAuth, API_ENDPOINTS } from '../api/apiConfig';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await apiClientNoAuth.post(API_ENDPOINTS.LOGIN, { username, password });
      const { data } = response.data;

      localStorage.setItem('jwt', data.jwt);
      localStorage.setItem('refresh', data.refresh);

      onLogin();
      navigate('/home');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleForgotPasswordClick = () => {
    navigate('/reset-password-req');
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
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
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Don't have an account? <Link onClick={handleSignUpClick} sx={{ cursor: 'pointer' }}>Sign up</Link>
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            <Link onClick={handleForgotPasswordClick} sx={{ cursor: 'pointer' }}>Forgot password?</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;