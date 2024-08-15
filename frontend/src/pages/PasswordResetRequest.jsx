import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Card, CardContent } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiClientNoAuth, API_ENDPOINTS } from '../api/apiConfig';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClientNoAuth.post(API_ENDPOINTS.PASSWORD_RESET_REQUEST, { email });
      toast.success('Password reset link has been sent to your email.');
    } catch (error) {
      toast.error('Failed to send password reset link. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>Reset Password</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default PasswordResetRequest;