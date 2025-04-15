// src/hooks/usechat.js
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './useAuth';
import {
  fetchChatHistory,
  sendMessage,
  receiveBotResponse,
  clearChat
} from '../store/slices/chatSlice';

/**
 * Custom hook for managing chat functionality with the AI assistant
 * @returns {Object} Chat state and functions
 */
export const useChat = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { messages, isLoading, error } = useSelector((state) => state.chat);
  const [inputMessage, setInputMessage] = useState('');
  const [typingIndicator, setTypingIndicator] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      // Load chat history when user is authenticated
      dispatch(fetchChatHistory());
    }
  }, [dispatch, user?.id]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: messageText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    try {
      // Add user message to chat
      await dispatch(sendMessage(userMessage)).unwrap();
      
      // Clear input field
      setInputMessage('');
      
      // Show typing indicator
      setTypingIndicator(true);
      
      // Simulate API call delay
      setTimeout(async () => {
        // Get AI response
        const response = await generateBotResponse(messageText);
        
        // Hide typing indicator
        setTypingIndicator(false);
        
        // Add bot response to chat
        await dispatch(receiveBotResponse({
          id: Date.now().toString(),
          content: response,
          sender: 'bot',
          timestamp: new Date().toISOString()
        })).unwrap();
      }, 1000); // Simulated delay
    } catch (err) {
      console.error("Failed to send message:", err);
      setTypingIndicator(false);
    }
  };

  // Generate AI response based on user message
  // In a real app, this would call an API endpoint
  const generateBotResponse = async (userMessage) => {
    try {
      // This would be replaced with an actual API call
      // to your backend or a service like OpenAI
      
      // Mock response logic for common mental health queries
      const lowercaseMessage = userMessage.toLowerCase();
      
      if (lowercaseMessage.includes('anxious') || lowercaseMessage.includes('anxiety')) {
        return "I understand you're feeling anxious. Deep breathing can help - try breathing in for 4 counts, hold for 4, then exhale for 6. Would you like to try some other anxiety-reducing techniques?";
      }
      
      if (lowercaseMessage.includes('sad') || lowercaseMessage.includes('depression')) {
        return "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. Have you been able to do any activities that usually bring you joy recently?";
      }
      
      if (lowercaseMessage.includes('stress') || lowercaseMessage.includes('overwhelm')) {
        return "Being stressed can be really challenging. Let's break things down - what's one small thing you could do right now to give yourself a moment of calm?";
      }
      
      if (lowercaseMessage.includes('sleep') || lowercaseMessage.includes('insomnia')) {
        return "Sleep troubles can affect our mental health significantly. Have you tried establishing a consistent bedtime routine? Things like avoiding screens an hour before bed and creating a comfortable sleep environment can help.";
      }
      
      // Default responses for other messages
      const defaultResponses = [
        "How are you feeling about that?",
        "Thank you for sharing. Can you tell me more about what's on your mind?",
        "I'm here to listen. What else would you like to talk about?",
        "That's interesting. How does that make you feel?",
        "I appreciate you opening up. What would be helpful for you right now?"
      ];
      
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm having trouble responding right now. Could you try again?";
    }
  };

  // Handle clearing chat history
  const handleClearChat = async () => {
    try {
      await dispatch(clearChat()).unwrap();
      return true;
    } catch (err) {
      console.error("Failed to clear chat:", err);
      return false;
    }
  };

  // Get the chat message history grouped by date
  const getMessagesByDate = () => {
    if (!messages || messages.length === 0) return [];
    
    const groupedMessages = messages.reduce((groups, message) => {
      const date = new Date(message.timestamp).toLocaleDateString();
      
      if (!groups[date]) {
        groups[date] = [];
      }
      
      groups[date].push(message);
      return groups;
    }, {});
    
    return Object.entries(groupedMessages).map(([date, messages]) => ({
      date,
      messages
    }));
  };

  return {
    messages,
    messagesByDate: getMessagesByDate(),
    inputMessage,
    setInputMessage,
    sendMessage: handleSendMessage,
    clearChat: handleClearChat,
    typingIndicator,
    messagesEndRef,
    isLoading,
    error
  };
};

export default useChat;