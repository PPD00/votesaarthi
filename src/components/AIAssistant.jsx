import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { sendMessageToAI } from '../services/aiService';
import './assistant.css';

/**
 * AIAssistant Component
 * 
 * Provides a real-time chat interface with Gemini AI integration.
 * Includes intent-aware redirects for core civic features.
 */
const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I am your VoteSaarthi AI. How can I help you with the elections today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // --- Intent Detection (Phase 2 Vision) ---
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('booth') || lowerMsg.includes('polling station') || lowerMsg.includes('where to vote')) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I can help you with that! You should use our 'Booth Finder' tool to locate your exact polling station. Would you like to go there now?",
        isSuggestion: true,
        link: '/booth-finder'
      }]);
      return;
    }

    // --- Send to Gemini ---
    setIsLoading(true);
    try {
      const reply = await sendMessageToAI(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError("Failed to reach the AI. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <Sparkles className="header-icon" />
        <h2>Civic AI Assistant</h2>
      </div>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.role}`}>
            <div className="message-icon">
              {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className="message-bubble">
              {msg.content}
              {msg.isSuggestion && (
                <button 
                  className="suggestion-btn" 
                  onClick={() => navigate(msg.link)}
                >
                  Go to Booth Finder
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-row assistant">
            <div className="message-icon"><Bot size={18} /></div>
            <div className="message-bubble thinking">
              <Loader2 className="spin" size={14} /> Thinking...
            </div>
          </div>
        )}
        {error && (
          <div className="error-banner">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSend}>
        <input
          type="text"
          placeholder={isLoading ? "AI is processing..." : "Ask about candidates, rights, or process..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
