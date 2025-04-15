// src/components/Dashboard/ActivityTracker.js
import React from 'react';
import { Box, Typography, Grid, Paper, LinearProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MoodIcon from '@mui/icons-material/Mood';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const ActivityTracker = () => {
  // This would ideally come from the backend
  const activities = [
    { 
      name: 'Chat Sessions', 
      icon: <ChatIcon color="primary" fontSize="large" />,
      value: 8,
      target: 10,
      unit: 'sessions'
    },
    { 
      name: 'Journal Entries', 
      icon: <EditNoteIcon color="secondary" fontSize="large" />,
      value: 12,
      target: 15,
      unit: 'entries'
    },
    { 
      name: 'Mood Tracking', 
      icon: <MoodIcon sx={{ color: '#FFB74D' }} fontSize="large" />,
      value: 24,
      target: 30,
      unit: 'days'
    },
    { 
      name: 'Resources Read', 
      icon: <MenuBookIcon sx={{ color: '#64B5F6' }} fontSize="large" />,
      value: 5,
      target: 10,
      unit: 'articles'
    }
  ];
  
  return (
    <Grid container spacing={2}>
      {activities.map((activity, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%' 
            }}
          >
            <Box sx={{ mb: 2 }}>
              {activity.icon}
            </Box>
            <Typography variant="h6" align="center" sx={{ mb: 1 }}>
              {activity.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
              {activity.value} of {activity.target} {activity.unit}
            </Typography>
            <Box sx={{ width: '100%', mt: 'auto' }}>
              <LinearProgress 
                variant="determinate" 
                value={(activity.value / activity.target) * 100}
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActivityTracker;

