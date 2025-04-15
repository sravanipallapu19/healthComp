// src/components/Dashboard/DailyTip.js
import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const DailyTip = () => {
  // In a real implementation, these would come from the backend
  const tips = [
    {
      title: "Practice Deep Breathing",
      content: "When you feel stressed, try breathing deeply through your nose for 4 seconds, hold for 2 seconds, and exhale through your mouth for 6 seconds. Repeat this 5-10 times."
    },
    {
      title: "Stay Hydrated",
      content: "Dehydration can worsen symptoms of anxiety and depression. Try to drink at least 8 glasses of water throughout the day."
    },
    {
      title: "Gratitude Practice",
      content: "Each night, write down three things you're grateful for. This simple practice can significantly improve your mood over time."
    },
    {
      title: "Limit Social Media",
      content: "Try setting a daily time limit for social media use. Excessive scrolling can increase anxiety and feelings of inadequacy."
    },
    {
      title: "Move Your Body",
      content: "Even a 10-minute walk can boost endorphins and improve your mood. Try to incorporate some form of movement into each day."
    }
  ];
  
  // Get a deterministic tip based on the day
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const tipIndex = dayOfYear % tips.length;
  const dailyTip = tips[tipIndex];
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'primary.light',
        color: 'primary.contrastText'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <LightbulbIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Daily Tip</Typography>
      </Box>
      
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
        {dailyTip.title}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, flexGrow: 1 }}>
        {dailyTip.content}
      </Typography>
      
      <Button 
        variant="contained" 
        color="secondary"
        sx={{ alignSelf: 'flex-start', mt: 'auto' }}
      >
        Get More Tips
      </Button>
    </Paper>
  );
};

export default DailyTip;