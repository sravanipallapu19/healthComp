// src/components/common/ErrorBoundary.js
import React, { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { logError } from '../../services/errorReporting';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to monitoring service
    logError(error, errorInfo);
    
    // Optionally call the onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  handleRefresh = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Trigger any provided refresh callbacks
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  };
  
  handleReportError = () => {
    // Implementation could send additional details to your error reporting service
    if (this.props.onReportError) {
      this.props.onReportError(this.state.error, this.state.errorInfo);
    }
    
    alert('Error report submitted. Thank you for helping us improve!');
  };

  render() {
    const { fallback, children } = this.props;
    
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return fallback;
      }
      
      const isDev = process.env.NODE_ENV === 'development';
      
      return (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            m: 2,
            borderRadius: 2,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          
          <Typography variant="h5" component="h2" gutterBottom>
            Something went wrong
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={this.handleRefresh}
            >
              Try Again
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={this.handleReportError}
            >
              Report Issue
            </Button>
          </Box>
          
          {/* Show technical details in development mode */}
          {isDev && this.state.error && (
            <Box sx={{ textAlign: 'left', width: '100%', mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Error Details (Development Only):
              </Typography>
              
              <Box 
                component="pre" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'grey.100', 
                  borderRadius: 1, 
                  overflow: 'auto',
                  fontSize: '0.75rem',
                  maxHeight: 200
                }}
              >
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </Box>
            </Box>
          )}
        </Paper>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

/**
 * Higher-order component to easily wrap components with ErrorBoundary
 * 
 * Usage:
 * const SafeComponent = withErrorBoundary(MyComponent);
 */
export const withErrorBoundary = (Component, options = {}) => {
  const WithErrorBoundary = (props) => (
    <ErrorBoundary {...options}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WithErrorBoundary.displayName = `WithErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
  
  return WithErrorBoundary;
};

/**
 * Creates an error reporting service stub
 * Note: This is just a stub - replace with your actual error reporting implementation
 */
export const createErrorBoundary = (config = {}) => {
  return (props) => (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Custom error handling logic
        if (config.onError) {
          config.onError(error, errorInfo);
        }
      }}
      {...config}
      {...props}
    />
  );
};