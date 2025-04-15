// src/components/common/Loaders.js
import React from 'react';
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material';

/**
 * FullPageLoader - Shows a centered loading spinner for full page loading states
 */
export const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      {message && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mt: 3, textAlign: 'center' }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

/**
 * ContentLoader - Shows a loading spinner for content areas
 */
export const ContentLoader = ({ message = 'Loading content...', size = 'medium' }) => {
  const spinnerSize = {
    small: 30,
    medium: 40,
    large: 50,
  }[size] || 40;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        minHeight: 200,
      }}
    >
      <CircularProgress size={spinnerSize} thickness={3} />
      {message && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

/**
 * ButtonLoader - Shows a small loader for button loading states
 */
export const ButtonLoader = ({ size = 24, color = 'inherit' }) => {
  return <CircularProgress size={size} color={color} thickness={4} />;
};

/**
 * CardSkeletonLoader - Shows skeleton placeholders for card-based content
 */
export const CardSkeletonLoader = ({ count = 3 }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {[...Array(count)].map((_, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
          <Skeleton variant="rectangular" width="60%" height={28} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="30%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={120} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

/**
 * TableSkeletonLoader - Shows skeleton placeholders for table content
 */
export const TableSkeletonLoader = ({ rows = 5, columns = 4 }) => {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header row */}
      <Box 
        sx={{ 
          display: 'flex', 
          mb: 1, 
          pb: 1, 
          borderBottom: '1px solid', 
          borderColor: 'divider' 
        }}
      >
        {[...Array(columns)].map((_, index) => (
          <Box 
            key={`header-${index}`} 
            sx={{ 
              flex: index === 0 ? 2 : 1, 
              pr: 2 
            }}
          >
            <Skeleton variant="text" width="80%" height={32} />
          </Box>
        ))}
      </Box>
      
      {/* Data rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <Box 
          key={`row-${rowIndex}`} 
          sx={{ 
            display: 'flex', 
            py: 1.5, 
            borderBottom: '1px solid', 
            borderColor: 'divider' 
          }}
        >
          {[...Array(columns)].map((_, colIndex) => (
            <Box 
              key={`cell-${rowIndex}-${colIndex}`} 
              sx={{ 
                flex: colIndex === 0 ? 2 : 1, 
                pr: 2 
              }}
            >
              <Skeleton 
                variant="text" 
                width={colIndex === columns - 1 ? "40%" : "80%"} 
                height={24} 
              />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

/**
 * ProfileSkeletonLoader - Shows skeleton placeholders for profile or user detail screens
 */
export const ProfileSkeletonLoader = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Skeleton variant="circular" width={120} height={120} sx={{ mr: 3 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="80%" height={20} />
        </Box>
      </Box>
      
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 3 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        {[...Array(3)].map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rectangular" 
            width="30%" 
            height={80} 
            sx={{ borderRadius: 1 }} 
          />
        ))}
      </Box>
      
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={200} />
    </Box>
  );
};

export default {
  FullPageLoader,
  ContentLoader,
  ButtonLoader,
  CardSkeletonLoader,
  TableSkeletonLoader,
  ProfileSkeletonLoader
};