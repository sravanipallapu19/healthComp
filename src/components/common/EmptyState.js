// src/components/common/EmptyState.js
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const EmptyState = ({ 
  title, 
  description, 
  icon: Icon = NoteAddIcon, 
  actionText,
  onAction,
  elevation = 0
}) => {
  return (
    <Paper 
      elevation={elevation}
      sx={{ 
        py: 6, 
        px: 4, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 2,
        bgcolor: 'background.default'
      }}
    >
      <Icon sx={{ fontSize: 70, color: 'text.secondary', mb: 2 }} />
      
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        {description}
      </Typography>
      
      {actionText && onAction && (
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          onClick={onAction}
          startIcon={<Icon />}
        >
          {actionText}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;