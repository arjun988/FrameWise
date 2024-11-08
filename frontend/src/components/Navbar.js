// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';

function Navbar() {
  return (
    <AppBar position="static" style={{ background: 'linear-gradient(45deg, #3d5afe, #ff4081)' }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 600 }}>
          FrameWise
        </Typography>
        <Button color="inherit" startIcon={<HomeIcon />} component={Link} to="/">Home</Button>
        <Button color="inherit" startIcon={<ExploreIcon />} component={Link} to="/demo">Demo</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
