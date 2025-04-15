// src/components/Chat/ChatMessage.js
import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const ChatMessage = ({ message, isUser, username }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            mr: 1,
          }}
        >
          MH
        </Avatar>
      )}
      
      <Box sx={{ maxWidth: '75%' }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 0.5,
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {isUser ? username : 'Health Companion'} • {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </Typography>
        
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isUser ? 'primary.light' : 'background.paper',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            borderRadius: '12px',
            borderTopRightRadius: isUser ? '4px' : '12px',
            borderTopLeftRadius: isUser ? '12px' : '4px',
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.content}
          </Typography>
        </Paper>
      </Box>
      
      {isUser && (
        <Avatar
          sx={{
            ml: 1,
            bgcolor: 'secondary.main',
          }}
        >
          {username.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage;

