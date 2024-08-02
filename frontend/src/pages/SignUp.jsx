import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClientNoAuth, API_ENDPOINTS } from '../api/apiConfig';
import { Button, TextField, Container, Typography } from '@mui/material';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    age: '', // Optional
    address: '', // Optional
  });

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
      console.error('Signup failed', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Sign Up</Typography>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <TextField
            key={key}
            name={key}
            label={key.replace('_', ' ').toUpperCase()}
            value={formData[key]}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required={key === 'username' || key === 'password' || key === 'email'}
          />
        ))}
        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default SignUp;
