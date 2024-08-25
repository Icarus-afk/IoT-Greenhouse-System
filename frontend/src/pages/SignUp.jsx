import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClientNoAuth, API_ENDPOINTS } from '../api/apiConfig';
import { Container, TextField, Button, Typography, Box, Link, IconButton, InputAdornment } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    confirmPassword: '',
    email: '',
    first_name: '',
    last_name: '',
    age: '',
    address: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      return;
    }
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await apiClientNoAuth.post(API_ENDPOINTS.SIGNUP, dataToSend);
      toast.success('Signup successful!');
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
      <ToastContainer />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {Object.keys(formData).map((key) => (
            key !== 'confirmPassword' && (
              <TextField
                key={key}
                name={key}
                label={key.replace('_', ' ').toUpperCase()}
                value={formData[key]}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required={['username', 'password', 'email'].includes(key)}
                type={key === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                InputProps={key === 'password' ? {
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
                } : null}
              />
            )
          ))}
          <TextField
            name="confirmPassword"
            label="CONFIRM PASSWORD"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type={showConfirmPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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