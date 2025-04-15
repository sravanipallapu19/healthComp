// src/pages/Journal.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Fab, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import JournalEntry from '../components/Journal/JournalEntry';
import JournalEditor from '../components/Journal/JournalEditor';
import EmptyState from '../components/common/EmptyState';
import { fetchJournalEntries } from '../store/slices/journalSlice';

const Journal = () => {
  const dispatch = useDispatch();
  const { entries, loading } = useSelector((state) => state.journal);
  const [openEditor, setOpenEditor] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all', 'recent', 'favorites'
  
  useEffect(() => {
    dispatch(fetchJournalEntries());
  }, [dispatch]);
  
  const handleNewEntry = () => {
    setSelectedEntry(null);
    setOpenEditor(true);
  };
  
  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setOpenEditor(true);
  };
  
  const handleCloseEditor = () => {
    setOpenEditor(false);
    setSelectedEntry(null);
  };
  
  const filteredEntries = entries.filter(entry => {
    if (viewMode === 'all') return true;
    if (viewMode === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(entry.date) >= oneWeekAgo;
    }
    if (viewMode === 'favorites') return entry.isFavorite;
    return true;
  });
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Journal</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleNewEntry}
        >
          New Entry
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', mb: 3 }}>
        <Button 
          variant={viewMode === 'all' ? 'contained' : 'outlined'} 
          onClick={() => setViewMode('all')}
          sx={{ mr: 1 }}
        >
          All Entries
        </Button>
        <Button 
          variant={viewMode === 'recent' ? 'contained' : 'outlined'} 
          onClick={() => setViewMode('recent')}
          sx={{ mr: 1 }}
        >
          Recent
        </Button>
        <Button 
          variant={viewMode === 'favorites' ? 'contained' : 'outlined'} 
          onClick={() => setViewMode('favorites')}
        >
          Favorites
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredEntries.length > 0 ? (
        <Grid container spacing={3}>
          {filteredEntries.map((entry) => (
            <Grid item xs={12} sm={6} md={4} key={entry.id}>
              <JournalEntry 
                entry={entry} 
                onEdit={() => handleEditEntry(entry)} 
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState 
          title="No Journal Entries Yet"
          description="Start documenting your thoughts and feelings to track your mental health journey."
          actionText="Create Your First Entry"
          onAction={handleNewEntry}
        />
      )}
      
      {/* Fixed Add Button */}
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={handleNewEntry}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <AddIcon />
      </Fab>
      
      {/* Journal Editor Dialog */}
      <Dialog 
        open={openEditor} 
        onClose={handleCloseEditor}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {selectedEntry ? "Edit Journal Entry" : "New Journal Entry"}
          <IconButton
            aria-label="close"
            onClick={handleCloseEditor}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <JournalEditor 
            entry={selectedEntry} 
            onClose={handleCloseEditor}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Journal;