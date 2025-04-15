// src/components/Layout/Layout.js
import React, { useState } from 'react';
import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import ErrorBoundary from '../common/ErrorBoundary';

/**
 * Main layout component containing the app's structure
 */
const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  // Handle mobile sidebar close
  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        sidebarOpen={sidebarOpen} 
        onSidebarToggle={handleSidebarToggle} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleSidebarClose}
        variant={isMobile ? 'temporary' : 'persistent'}
      />
      
      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          pt: { xs: 7, sm: 8 },
          ml: !isMobile && sidebarOpen ? `${theme.spacing(30)}` : 0,
          width: !isMobile && sidebarOpen ? `calc(100% - ${theme.spacing(30)})` : '100%',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default Layout;