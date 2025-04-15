// src/components/Chat/SuggestionChips.js
import React from 'react';
import { Box, Chip } from '@mui/material';

const SuggestionChips = ({ suggestions, onChipClick }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
      {suggestions.map((suggestion, index) => (
        <Chip
          key={index}
          label={suggestion}
          onClick={() => onChipClick(suggestion)}
          color="primary"
          variant="outlined"
          clickable
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  );
};

export default SuggestionChips;