
// src/components/Journal/EmotionPicker.js
import React from 'react';
import { 
  Box, 
  ToggleButtonGroup, 
  ToggleButton, 
  Typography, 
  FormHelperText 
} from '@mui/material';
import { emotions } from '../../constants/emotionTypes';

/**
 * Component for selecting an emotion for journal entries
 */
const EmotionPicker = ({ 
  selectedEmotion, 
  onSelectEmotion, 
  error = false,
  helperText = ''
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <ToggleButtonGroup
        value={selectedEmotion}
        exclusive
        onChange={(e, newEmotion) => {
          // Don't allow deselection, only changing to a new emotion
          if (newEmotion !== null) {
            onSelectEmotion(newEmotion);
          }
        }}
        aria-label="emotion selection"
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          '& .MuiToggleButtonGroup-grouped': {
            m: 0.5,
            borderRadius: 1,
            '&.Mui-selected': {
              borderColor: 'primary.main',
            }
          }
        }}
      >
        {emotions.map((emotion) => (
          <ToggleButton 
            key={emotion.id} 
            value={emotion.id}
            aria-label={emotion.label}
            sx={{ 
              p: 1,
              borderColor: error ? 'error.main' : undefined,
              '&.Mui-selected': {
                backgroundColor: theme => `${theme.palette[emotion.color || 'primary'].light}30`,
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ fontSize: '1.5rem', mb: 0.5 }}>
                {emotion.icon}
              </Box>
              <Typography variant="caption" sx={{ textTransform: 'none' }}>
                {emotion.label}
              </Typography>
            </Box>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      
      {error && helperText && (
        <FormHelperText error>{helperText}</FormHelperText>
      )}
    </Box>
  );
};

export default EmotionPicker;





