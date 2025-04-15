// src/components/Journal/JournalEditor.js
/*import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Typography,
  Autocomplete
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createJournalEntry, updateJournalEntry } from '../../store/slices/journalSlice';

const MOODS = ['Happy', 'Excited', 'Grateful', 'Relaxed', 'Calm', 'Content', 'Tired', 'Stressed', 'Anxious', 'Frustrated', 'Sad', 'Overwhelmed'];

const SUGGESTED_TAGS = ['self-care', 'achievement', 'challenge', 'reflection', 'growth', 'setback', 'therapy', 'medication', 'exercise', 'nutrition', 'sleep', 'relationships', 'work', 'leisure'];

const JournalEditor = ({ entry, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = Boolean(entry);
  
  const [formData, setFormData] = useState({
    title: '',
    date: new Date(),
    mood: '',
    content: '',
    tags: [],
    isFavorite: false
  });
  
  useEffect(() => {
    if (entry) {
      setFormData({
        ...entry,
        date: new Date(entry.date)
      });
    }
  }, [entry]);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDateChange = (newDate) => {
    setFormData(prev => ({
      ...prev,
      date: newDate
    }));
  };
  
  const handleTagsChange = (event, newValue) => {
    setFormData(prev => ({
      ...prev,
      tags: newValue
    }));
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const journalData = {
      ...formData,
      date: formData.date.toISOString()
    };
    
    if (isEditing) {
      dispatch(updateJournalEntry({ id: entry.id, ...journalData }));
    } else {
      dispatch(createJournalEntry(journalData));
    }
    
    onClose();
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            name="title"
            label="Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth required />}
              maxDate={new Date()}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="mood-select-label">How are you feeling?</InputLabel>
            <Select
              labelId="mood-select-label"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              label="How are you feeling?"
            >
              {MOODS.map((mood) => (
                <MenuItem key={mood} value={mood}>{mood}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={SUGGESTED_TAGS}
            value={formData.tags}
            onChange={handleTagsChange}
            freeSolo
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip 
                  label={option} 
                  {...getTagProps({ index })} 
                  key={option} 
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Add tags"
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            name="content"
            label="Journal Entry"
            value={formData.content}
            onChange={handleChange}
            multiline
            rows={12}
            fullWidth
            required
            placeholder="Write about your thoughts, feelings, and experiences..."
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {isEditing ? 'Update Entry' : 'Save Entry'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JournalEditor;    */

  
  // src/components/Journal/JournalEditor.js
  import React, { useState, useEffect } from 'react';
  import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Button, 
    Box,
    IconButton,
    Typography,
    Chip,
    InputAdornment,
    DialogContentText,
    Divider
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
  import TagIcon from '@mui/icons-material/Tag';
  import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
  import EmotionPicker from './EmotionPicker';
  
  /**
   * Component for creating and editing journal entries
   */
  const JournalEditor = ({ 
    open, 
    onClose, 
    onSave, 
    entry = null,
    promptSuggestions = []
  }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [emotion, setEmotion] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [errors, setErrors] = useState({});
  
    // Load entry data if editing an existing entry
    useEffect(() => {
      if (entry) {
        setTitle(entry.title || '');
        setContent(entry.content || '');
        setEmotion(entry.emotion || '');
        setTags(entry.tags || []);
      } else {
        // Clear form for new entry
        setTitle('');
        setContent('');
        setEmotion('');
        setTags([]);
      }
    }, [entry, open]);
  
    // Handle tag addition
    const handleAddTag = () => {
      if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    };
  
    // Handle tag input key press (Enter to add)
    const handleTagKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      }
    };
  
    // Handle tag removal
    const handleRemoveTag = (tagToRemove) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
    };
  
    // Handle form submission
    const handleSubmit = () => {
      // Validate form
      const newErrors = {};
      if (!title.trim()) newErrors.title = 'Title is required';
      if (!content.trim()) newErrors.content = 'Content is required';
      if (!emotion) newErrors.emotion = 'Please select an emotion';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      
      // Create entry object
      const journalEntry = {
        id: entry ? entry.id : `entry-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        emotion,
        tags,
        timestamp: entry ? entry.timestamp : new Date().toISOString(),
        lastModified: new Date().toISOString(),
        isFavorite: entry ? entry.isFavorite : false,
      };
      
      onSave(journalEntry);
      onClose();
    };
  
    // Handle applying a journal prompt
    const handleApplyPrompt = (promptText) => {
      setContent(prevContent => {
        if (prevContent.trim() === '') {
          return promptText;
        } else {
          return `${prevContent}\n\n${promptText}`;
        }
      });
    };
  
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="journal-editor-title"
      >
        <DialogTitle id="journal-editor-title">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              {entry ? 'Edit Journal Entry' : 'New Journal Entry'}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          {/* Title input */}
          <TextField
            autoFocus
            margin="dense"
            id="entry-title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
          />
          
          {/* Emotion picker */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              How are you feeling?
            </Typography>
            <EmotionPicker 
              selectedEmotion={emotion} 
              onSelectEmotion={setEmotion} 
              error={!!errors.emotion}
              helperText={errors.emotion}
            />
          </Box>
          
          {/* Journal content */}
          <TextField
            margin="dense"
            id="entry-content"
            label="Write your thoughts..."
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            error={!!errors.content}
            helperText={errors.content}
            sx={{ mb: 3 }}
          />
          
          {/* Journal prompts */}
          {promptSuggestions.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Journaling Prompts
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {promptSuggestions.map((prompt, index) => (
                  <Chip
                    key={index}
                    label={prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '')}
                    onClick={() => handleApplyPrompt(prompt)}
                    color="primary"
                    variant="outlined"
                    clickable
                  />
                ))}
              </Box>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          {/* Tags input */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <TextField
              margin="dense"
              id="entry-tags"
              placeholder="Add tag and press Enter"
              fullWidth
              variant="outlined"
              size="small"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TagIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      edge="end" 
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          {/* Tags display */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                size="small"
              />
            ))}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {entry ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default JournalEditor;   