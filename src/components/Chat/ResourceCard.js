// src/components/Chat/ResourceCards.js
import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  CardMedia, 
  Button, 
  Chip, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import LaunchIcon from '@mui/icons-material/Launch';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MeditationIcon from '@mui/icons-material/SelfImprovement';
import ExerciseIcon from '@mui/icons-material/FitnessCenter';

/**
 * ResourceCards component for displaying helpful resources in chat
 * Displays a collection of resources related to mental health topics
 */
const ResourceCards = ({ 
  resources = [], 
  savedResources = [], 
  onSaveResource, 
  onViewResource,
  title = "Helpful Resources" 
}) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  // Get appropriate icon based on resource type
  const getResourceIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'article':
        return <ArticleIcon />;
      case 'video':
        return <VideoLibraryIcon />;
      case 'guide':
        return <MenuBookIcon />;
      case 'meditation':
        return <MeditationIcon />;
      case 'exercise':
        return <ExerciseIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  // Get color based on resource type
  const getResourceColor = (type, theme) => {
    switch(type?.toLowerCase()) {
      case 'article':
        return theme.palette.info.main;
      case 'video':
        return theme.palette.error.main;
      case 'guide':
        return theme.palette.success.main;
      case 'meditation':
        return theme.palette.secondary.main;
      case 'exercise':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Check if a resource is saved
  const isResourceSaved = (resourceId) => {
    return savedResources.some(item => item.id === resourceId);
  };

  return (
    <Box sx={{ mt: 3, mb: 3 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {resources.map((resource) => (
          <Card 
            key={resource.id} 
            elevation={2}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '4px solid',
              borderColor: theme => getResourceColor(resource.type, theme)
            }}
          >
            {resource.imageUrl && (
              <CardMedia
                component="img"
                height="140"
                image={resource.imageUrl}
                alt={resource.title}
              />
            )}
            
            <CardContent sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ color: 'text.secondary', mr: 1.5, mt: 0.5 }}>
                  {getResourceIcon(resource.type)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {resource.description}
                  </Typography>
                </Box>
              </Box>
              
              {resource.tags && resource.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {resource.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </CardContent>
            
            <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
              <Box>
                <Chip 
                  label={resource.type || 'Resource'} 
                  size="small"
                  sx={{ 
                    bgcolor: theme => getResourceColor(resource.type, theme),
                    color: 'white',
                    textTransform: 'capitalize'
                  }}
                />
                {resource.duration && (
                  <Chip 
                    label={resource.duration} 
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              
              <Box>
                <Tooltip title={isResourceSaved(resource.id) ? "Remove from saved" : "Save for later"}>
                  <IconButton 
                    size="small"
                    onClick={() => onSaveResource && onSaveResource(resource)}
                  >
                    {isResourceSaved(resource.id) ? 
                      <BookmarkIcon color="primary" /> : 
                      <BookmarkBorderIcon />
                    }
                  </IconButton>
                </Tooltip>
                
                <Button
                  size="small"
                  endIcon={<LaunchIcon />}
                  onClick={() => onViewResource && onViewResource(resource)}
                >
                  View
                </Button>
              </Box>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ResourceCards;