import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
  
    const handleInputChange = (e) => {
      setInput(e.target.value);
    };
  
    const handleSend = async () => {
      if (input.trim()) {
        const userMessage = { sender: 'user', text: input };
        setMessages([...messages, userMessage]);
  
        // Send user message to the chatbot API
        const response = await axios.post('/api/chat', { message: input });
        const botMessage = { sender: 'bot', text: response.data.reply };
  
        setMessages([...messages, userMessage, botMessage]);
        setInput('');
      }
    };
  
  


  return (
    <div>
      <>
      <Box p={2}>
      <Typography variant="h4">Spice Information Chatbot</Typography>
      <Paper elevation={3} style={{ maxHeight: '60vh', overflow: 'auto', padding: '10px', margin: '10px 0' }}>
        {messages.map((msg, index) => (
          <Typography key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </Typography>
        ))}
      </Paper>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Ask me about spices..."
        value={input}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={handleSend} style={{ marginTop: '10px' }}>
        Send
      </Button>
    </Box>

      
      </>
    </div>
  )
}
