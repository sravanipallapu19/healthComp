// src/components/Journal/JournalEntry.js
/*import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Chip
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toggleFavoriteEntry, deleteJournalEntry } from '../../store/slices/journalSlice';
import ConfirmDialog from '../common/ConfirmDialog';

const JournalEntry = ({ entry, onEdit }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteEntry(entry.id));
  };
  
  const handleEdit = () => {
    handleMenuClose();
    onEdit(entry);
  };
  
  const handleDeleteClick = () => {
    handleMenuClose();
    setConfirmDelete(true);
  };
  
  const handleConfirmDelete = () => {
    dispatch(deleteJournalEntry(entry.id));
    setConfirmDelete(false);
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };
  
  // Format the date for display
  const formattedDate = formatDistanceToNow(new Date(entry.date), { addSuffix: true });
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="h2" noWrap>
            {entry.title}
          </Typography>
          <IconButton 
            aria-label="entry options" 
            size="small" 
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2 }}
        >
          {formattedDate}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {entry.mood && (
            <Chip 
              label={entry.mood} 
              size="small" 
              color={getMoodColor(entry.mood)}
              sx={{ mr: 1, mb: 1 }}
            />
          )}
          {entry.tags && entry.tags.map(tag => (
            <Chip 
              key={tag} 
              label={tag} 
              size="small" 
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        
        <Typography 
          variant="body1" 
          paragraph 
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {entry.content}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <IconButton 
          onClick={handleToggleFavorite} 
          color={entry.isFavorite ? "primary" : "default"}
          aria-label={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
          size="small"
        >
          {entry.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        
        <IconButton 
          onClick={handleEdit}
          size="small"
          aria-label="Edit entry"
        >
          <EditIcon />
        </IconButton>
      </CardActions>
      
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Journal Entry"
        content="Are you sure you want to delete this journal entry? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </Card>
  );
};

// Helper function to determine chip color based on mood
const getMoodColor = (mood) => {
  const moodMap = {
    'happy': 'success',
    'calm': 'info',
    'anxious': 'warning',
    'sad': 'error',
    'neutral': 'default'
  };
  
  return moodMap[mood.toLowerCase()] || 'default';
};

export default JournalEntry; */










// src/components/Journal/JournalEntry.js
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  CardActions,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { formatDistanceToNow } from 'date-fns';
import { emotions } from '../../constants/emotionTypes';

/**
 * Component for displaying a single journal entry
 */
const JournalEntry = ({ 
    entry, 
    onEdit, 
    onDelete, 
    onToggleFavorite,
    expanded = false
  }) => {
    // Find the emotion object by ID
    const emotionData = emotions.find(e => e.id === entry.emotion) || { 
      label: 'Unknown', 
      color: 'default',
      icon: null 
    };
  
    return (
      <Card elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent>
          {/* Entry header with date and emotion */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {new Date(entry.timestamp).toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              <Typography 
                component="span" 
                variant="caption" 
                color="text.secondary" 
                sx={{ ml: 1 }}
              >
                ({formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })})
              </Typography>
            </Typography>
            
            <Chip 
              icon={emotionData.icon}
              label={emotionData.label} 
              size="small"
              color={emotionData.color || "default"}
              variant="outlined"
            />
          </Box>
          
          {/* Entry title */}
          <Typography variant="h6" component="h3" gutterBottom>
            {entry.title}
          </Typography>
          
          {/* Entry content - show full or truncated based on expanded prop */}
          <Typography 
            variant="body2" 
            color="text.primary"
            sx={{
              whiteSpace: expanded ? 'pre-wrap' : 'normal',
              overflow: 'hidden',
              textOverflow: expanded ? 'clip' : 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: expanded ? 'none' : 3,
            }}
          >
            {entry.content}
          </Typography>
          
          {/* Only show tags if there are any */}
          {entry.tags && entry.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
              {entry.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  variant="outlined" 
                  sx={{ borderRadius: 1 }} 
                />
              ))}
            </Box>
          )}
        </CardContent>
        
        <Divider />
        
        {/* Actions */}
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => onToggleFavorite(entry.id)}
              color={entry.isFavorite ? "error" : "default"}
              aria-label={entry.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {entry.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          
          <Box>
            <IconButton 
              size="small" 
              onClick={() => onEdit(entry)}
              aria-label="Edit journal entry"
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(entry.id)}
              aria-label="Delete journal entry"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    );
  };
  
  export default JournalEntry;