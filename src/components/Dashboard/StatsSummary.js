// src/components/Dashboard/StatsSummary.js
import React from 'react';
import { Box, Typography, Grid, Chip, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { EMOTIONS } from '../../constants/emotionTypes';

const StatsSummary = ({ stats }) => {
  const { weeklyAverage, monthlyAverage, topEmotions, improvement } = stats;
  
  // Determine trend icon
  const getTrendIcon = (value) => {
    if (value > 0.05) return <TrendingUpIcon color="success" />;
    if (value < -0.05) return <TrendingDownIcon color="error" />;
    return <TrendingFlatIcon color="action" />;
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    const absValue = Math.abs(value);
    return `${(absValue * 100).toFixed(1)}%`;
  };
  
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Weekly Average
          </Typography>
          <Typography variant="h5">
            {weeklyAverage.toFixed(1)}/5
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Monthly Average
          </Typography>
          <Typography variant="h5">
            {monthlyAverage.toFixed(1)}/5
          </Typography>
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Trend
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getTrendIcon(improvement)}
            <Typography 
              variant="body1" 
              sx={{ ml: 1 }} 
              color={improvement > 0 ? 'success.main' : improvement < 0 ? 'error.main' : 'text.secondary'}
            >
              {improvement > 0 ? '+' : ''}{formatPercentage(improvement)} from last period
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Top Emotions
          </Typography>
          <Box>
            {topEmotions.length > 0 ? (
              topEmotions.map((emotion, index) => {
                const emotionData = EMOTIONS[emotion.id.toUpperCase()];
                return (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Chip 
                        label={emotionData?.label || emotion.id} 
                        size="small"
                        sx={{ 
                          bgcolor: emotionData?.color || '#ccc',
                          color: '#fff',
                          fontWeight: 'bold'
                        }}
                      />
                      <Typography variant="body2">
                        {(emotion.frequency * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={emotion.frequency * 100} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 1,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: emotionData?.color || '#ccc'
                        }
                      }} 
                    />
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No emotion data available yet
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsSummary;

