import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiClientNoAuth, API_ENDPOINTS } from '../api/apiConfig';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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