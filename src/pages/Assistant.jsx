import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { User, Bot, Sparkles, ChevronRight, ArrowRight, MessageCircle } from 'lucide-react';
import flowsData from '../data/flows.json';
import './assistant.css';

const Assistant = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Namaste! I am your VoteSaarthi Assistant. How can I help you today?',
      isInitial: true
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Map intents to display labels
  const intentLabels = useMemo(() => ({
    'ELIGIBILITY_CHECK': 'Am I eligible to vote?',
    'FAKE_VOTE_ISSUE': 'Someone else cast my vote',
    'POLLING_BOOTH_HELP': 'Find my polling booth',
    'VOTER_RIGHTS': 'What are my voter rights?'
  }), []);

  const handleChoice = (intent) => {
    const label = intentLabels[intent] || intent;
    const userMessage = { role: 'user', content: label };
    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const flow = flowsData.find(f => f.intent === intent);
      
      if (flow) {
        if (flow.intent === 'ELIGIBILITY_CHECK') {
          // Special case for eligibility check (displaying questions)
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "To check your eligibility, please answer these requirements:",
            steps: flow.questions.map(q => q.question),
            nextAction: { label: "View Detailed Guide", link: "/guide" }
          }]);
        } else if (flow.intent === 'VOTER_RIGHTS') {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "You have several fundamental rights as a voter in India.",
            nextAction: { label: "Read All Rights", link: "/guide" }
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: flow.intent === 'FAKE_VOTE_ISSUE' ? 
              "This is a serious issue. Please follow these steps immediately:" : 
              "Finding your booth is simple. Here is how you can do it:",
            steps: flow.steps,
            nextAction: flow.intent === 'POLLING_BOOTH_HELP' ? 
              { label: "Open Booth Finder", link: "/booth-finder" } : 
              { label: "Call Helpline", link: "/helpline" }
          }]);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm sorry, I don't have information on that specific topic yet. Try one of these common queries:",
          isFallback: true
        }]);
      }
    }, 600);
  };

  return (
    <div className="assistant-page container">
      <div className="assistant-header">
        <h1><Sparkles className="sparkle-icon" /> Smart Assistant</h1>
        <p>Guided support for all your election queries.</p>
      </div>

      <div className="chat-container">
        <div className="messages-list">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-wrapper ${msg.role} ${msg.isInitial ? 'initial' : ''}`}>
              <div className="avatar">
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-content">
                <p>{msg.content}</p>
                
                {msg.steps && (
                  <ul className="step-list">
                    {msg.steps.map((step, sIdx) => (
                      <li key={sIdx} className="step-item">
                        <span className="step-num">{sIdx + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                )}

                {msg.nextAction && (
                  <Link to={msg.nextAction.link} className="next-action-btn">
                    {msg.nextAction.label} <ArrowRight size={16} />
                  </Link>
                )}

                {(msg.isInitial || msg.isFallback) && (
                  <div className="choice-grid">
                    {flowsData.map((flow) => (
                      <button 
                        key={flow.intent} 
                        onClick={() => handleChoice(flow.intent)} 
                        className="choice-btn"
                      >
                        {intentLabels[flow.intent] || flow.intent} <ChevronRight size={14} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="assistant-info-footer">
        <p><MessageCircle size={14} /> Fast response driven by structured election datasets.</p>
      </div>
    </div>
  );
};

export default Assistant;
