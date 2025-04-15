// src/pages/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChatMessage from '../components/Chat/ChatMessage';
import SuggestionChips from '../components/Chat/SuggestionChips';
import { sendMessage, addMessage, clearChat, saveConversation } from '../store/slices/chatSlice';

const Chat = () => {
  const dispatch = useDispatch();
  const { messages, suggestions, sending, currentConversationTitle } = useSelector((state) => state.chat);
  const { profile } = useSelector((state) => state.user);
  const [input, setInput] = useState('');
  const [title, setTitle] = useState(currentConversationTitle);
  const [isSaving, setIsSaving] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    dispatch(addMessage(userMessage));
    setInput('');
    
    // Send message to API
    await dispatch(sendMessage(input));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleSaveConversation = async () => {
    setIsSaving(true);
    await dispatch(saveConversation(title));
    setIsSaving(false);
  };

  const handleNewChat = () => {
    dispatch(clearChat());
    setTitle('New Conversation');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Conversation Title"
          sx={{ flexGrow: 1, mr: 2 }}
        />
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={handleSaveConversation}
          disabled={isSaving || messages.length === 0}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
        <IconButton color="primary" onClick={handleNewChat} title="New Chat">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          mb: 2, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Welcome to your Mental Health Companion
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              I'm here to listen, provide support, and offer guidance. How are you feeling today?
            </Typography>
            <SuggestionChips 
              suggestions={suggestions} 
              onChipClick={handleSuggestionClick} 
            />
          </Box>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isUser={message.sender === 'user'}
                username={profile?.name || 'You'}
              />
            ))}
            {sending && (
              <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                <Typography variant="body2">Thinking...</Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Paper>

      <Box sx={{ display: 'flex', mb: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={4}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!input.trim() || sending}
        >
          Send
        </Button>
      </Box>
      
      {messages.length > 0 && (
        <SuggestionChips 
          suggestions={suggestions} 
          onChipClick={handleSuggestionClick} 
        />
      )}
    </Box>
  );
};

export default Chat;

