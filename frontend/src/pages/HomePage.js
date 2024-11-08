// src/pages/HomePage.js
import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Container>
        <Typography variant="h3" style={{ color: '#ffffff', fontWeight: 600, marginBottom: '20px' }}>
          Welcome to FrameWise
        </Typography>
        <Typography variant="h6" color="textSecondary" style={{ marginBottom: '40px', color: '#ddd' }}>
          Your AI-powered documentation assistant. Extract insights instantly.
        </Typography>
        <Button variant="contained" color="secondary" size="large" component={Link} to="/demo">
          Try the Demo
        </Button>
      </Container>
    </Box>
  );
}

export default HomePage;
