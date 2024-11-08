// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import Box from '@mui/material/Box';

function App() {
  return (
    <Router>
      <Box
        sx={{
          backgroundColor: '#1e1e2f', // Matching DemoPage background color
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
