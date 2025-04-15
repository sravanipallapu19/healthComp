// src/components/Dashboard/MoodChart.js
import React from 'react';
import { Box, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { EMOTIONS, EMOTION_GROUPS } from '../../constants/emotionTypes';

const MoodChart = ({ moodData }) => {
  const theme = useTheme();
  
  // Process data for chart
  const chartData = moodData.map(entry => {
    const formattedDate = format(new Date(entry.date), 'MMM dd');
    
    const emotionValues = {};
    entry.emotions.forEach(emotion => {
      emotionValues[emotion.id] = emotion.intensity;
    });
    
    return {
      date: formattedDate,
      ...emotionValues
    };
  });
  
  // Determine which emotions to show (only those with data)
  const activeEmotions = {};
  moodData.forEach(entry => {
    entry.emotions.forEach(emotion => {
      activeEmotions[emotion.id] = true;
    });
  });
  
  const activeEmotionIds = Object.keys(activeEmotions);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 2, 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 1
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => {
            const emotion = EMOTIONS[entry.dataKey.toUpperCase()];
            return (
              <p key={index} style={{ margin: '5px 0', color: entry.color }}>
                {emotion ? emotion.label : entry.dataKey}: {entry.value}
              </p>
            );
          })}
        </Box>
      );
    }
    return null;
  };
  
  // No data state
  if (chartData.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 300,
        color: 'text.secondary'
      }}>
        No mood data available yet. Start tracking your mood!
      </Box>
    );
  }
  
  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {activeEmotionIds.map(emotionId => {
            const emotion = EMOTIONS[emotionId.toUpperCase()];
            if (!emotion) return null;
            
            return (
              <Line
                key={emotionId}
                type="monotone"
                dataKey={emotionId}
                stroke={emotion.color}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MoodChart;

